import { Hono } from "hono";
import { handle } from "hono/vercel";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
import {
    BUCKET_LEGAL_DOCS,
    BUCKET_USER_VAULT,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    uploadFile,
    removeFiles,
    getPublicUrl,
    extractPathFromUrl,
} from "@/lib/storage";

const app = new Hono().basePath("/api/hono");

// ==========================================
// POST /api/hono/register
// ==========================================
app.post("/register", async (c) => {
    try {
        const body = await c.req.json();
        const { name, email, password, confirmPassword, alamat, telepon, recaptchaToken } = body;

        // Validation
        if (!recaptchaToken) {
            return c.json({ error: "Harap verifikasi captcha terlebih dahulu" }, 400);
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (secretKey) {
            const verifyRes = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
                { method: "POST" }
            );
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                return c.json({ error: "Verifikasi Captcha gagal" }, 400);
            }
        }

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return c.json(
                { error: "Nama, email, password, dan konfirmasi password harus diisi" },
                400
            );
        }

        if (password.length < 8) {
            return c.json(
                { error: "Password minimal 8 karakter" },
                400
            );
        }

        if (password !== confirmPassword) {
            return c.json({ error: "Password dan konfirmasi password tidak sama" }, 400);
        }

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return c.json({ error: "Email sudah terdaftar" }, 400);
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                alamat: alamat || null,
                telepon: telepon || null,
            },
        });

        return c.json(
            {
                message: "Registrasi berhasil",
                user: { id: user.id, name: user.name, email: user.email },
            },
            201
        );
    } catch (error) {
        console.error("Register error:", error);
        return c.json({ error: "Terjadi kesalahan saat registrasi" }, 500);
    }
});

// ==========================================
// POST /api/hono/forgot-password
// ==========================================
app.post("/forgot-password", async (c) => {
    try {
        const { email, recaptchaToken } = await c.req.json();

        if (!email) {
            return c.json({ error: "Email harus diisi" }, 400);
        }

        if (!recaptchaToken) {
            return c.json({ error: "Harap verifikasi captcha terlebih dahulu" }, 400);
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (secretKey) {
            const verifyRes = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
                { method: "POST" }
            );
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                return c.json({ error: "Verifikasi Captcha gagal" }, 400);
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return c.json({
                message:
                    "Jika email terdaftar, kami akan mengirimkan link reset password",
            });
        }

        // Generate reset token
        const resetToken = randomBytes(32).toString("hex");
        const resetTokenExp = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExp },
        });

        // Send email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: `"Akses Legal Indonesia" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: "Reset Password - Akses Legal Indonesia",
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2a6ba7; margin: 0;">Akses Legal Indonesia</h1>
          </div>
          <div style="background: #f9fafb; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Reset Password</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Halo <strong>${user.name}</strong>,
            </p>
            <p style="color: #6b7280; line-height: 1.6;">
              Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk membuat password baru:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #2a6ba7; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
              Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
            </p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} PT Akses Legal Indonesia. All rights reserved.
          </p>
        </div>
      `,
        });

        return c.json({
            message: "Jika email terdaftar, kami akan mengirimkan link reset password",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return c.json({ error: "Terjadi kesalahan, silakan coba lagi" }, 500);
    }
});

// ==========================================
// POST /api/hono/reset-password
// ==========================================
app.post("/reset-password", async (c) => {
    try {
        const { token, password, confirmPassword } = await c.req.json();

        if (!token || !password || !confirmPassword) {
            return c.json({ error: "Semua field harus diisi" }, 400);
        }

        if (password.length < 8) {
            return c.json({ error: "Password minimal 8 karakter" }, 400);
        }

        if (password !== confirmPassword) {
            return c.json({ error: "Password dan konfirmasi password tidak sama" }, 400);
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExp: { gt: new Date() },
            },
        });

        if (!user) {
            return c.json(
                { error: "Token tidak valid atau sudah kadaluarsa" },
                400
            );
        }

        const hashedPassword = await hash(password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExp: null,
            },
        });

        return c.json({ message: "Password berhasil diubah" });
    } catch (error) {
        console.error("Reset password error:", error);
        return c.json({ error: "Terjadi kesalahan, silakan coba lagi" }, 500);
    }
});

// ==========================================
// GET /api/hono/admin/users (Admin Only)
// ==========================================
app.get("/admin/users", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                alamat: true,
                telepon: true,
                createdAt: true,
            },
        });

        return c.json({ users });
    } catch (error) {
        console.error("Admin get users error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// ==========================================
// DELETE /api/hono/admin/users/:id (Admin Only)
// ==========================================
app.delete("/admin/users/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const userId = c.req.param("id");

        // Prevent deleting yourself
        if (userId === session.user.id) {
            return c.json({ error: "Tidak dapat menghapus akun sendiri" }, 400);
        }

        // Check if user exists and is not a super admin
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!targetUser) {
            return c.json({ error: "User tidak ditemukan" }, 404);
        }

        if (targetUser.role === "SUPER_ADMIN") {
            return c.json({ error: "Tidak dapat menghapus super admin" }, 400);
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return c.json({ message: "User berhasil dihapus" });
    } catch (error) {
        console.error("Admin delete user error:", error);
        return c.json({ error: "Terjadi kesalahan saat menghapus user" }, 500);
    }
});

// ==========================================
// SERVICES CRUD (Admin Only)
// ==========================================

// GET /api/hono/admin/services
app.get("/admin/services", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const services = await prisma.service.findMany({
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { applications: true } } },
        });

        return c.json({ services });
    } catch (error) {
        console.error("Get services error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// POST /api/hono/admin/services
app.post("/admin/services", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const { name, description, price } = await c.req.json();
        if (!name) return c.json({ error: "Nama layanan harus diisi" }, 400);

        const service = await prisma.service.create({
            data: { name, description: description || null, price: price || 0 },
        });

        return c.json({ service }, 201);
    } catch (error) {
        console.error("Create service error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// ==========================================
// APPLICATIONS MANAGEMENT
// ==========================================

// GET /api/hono/applications (User: own, Admin: all or by userId)
app.get("/applications", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const userId = c.req.query("userId");
        const isAdmin = session.user.role === "SUPER_ADMIN";

        const where = isAdmin && userId
            ? { userId }
            : isAdmin
                ? {}
                : { userId: session.user.id };

        const applications = await prisma.application.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                service: true,
                documents: true,
                user: { select: { id: true, name: true, email: true } },
                companyData: {
                    include: {
                        directors: true,
                        agreements: true,
                        taxReports: { orderBy: { date: "desc" } }
                    }
                }
            },
        });

        return c.json({ applications });
    } catch (error) {
        console.error("Get applications error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// POST /api/hono/admin/applications (Admin: add service to user)
app.post("/admin/applications", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const { userId, serviceId, name, status, estimate } = await c.req.json();
        if (!userId || !serviceId) {
            return c.json({ error: "userId dan serviceId harus diisi" }, 400);
        }

        const application = await prisma.application.create({
            data: {
                userId,
                serviceId,
                name: name || "",
                status: status || "PENDING",
                estimate: estimate || null,
            },
            include: { service: true },
        });

        return c.json({ application }, 201);
    } catch (error) {
        console.error("Create application error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// PATCH /api/hono/admin/applications/:id (Admin: update status)
app.patch("/admin/applications/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const id = c.req.param("id");
        const body = await c.req.json();

        const application = await prisma.application.update({
            where: { id },
            data: {
                ...(body.status && { status: body.status }),
                ...(body.name && { name: body.name }),
                ...(body.estimate !== undefined && { estimate: body.estimate }),
            },
            include: { service: true },
        });

        return c.json({ application });
    } catch (error) {
        console.error("Update application error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// GET /api/hono/admin/applications/:id
app.get("/admin/applications/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const id = c.req.param("id");
        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                service: true,
                documents: true,
                user: {
                    select: { name: true, email: true }
                },
                companyData: {
                    include: {
                        directors: true,
                        agreements: true,
                        taxReports: {
                            orderBy: { date: "desc" }
                        }
                    }
                }
            },
        });

        if (!application) return c.json({ error: "Application not found" }, 404);

        return c.json({ application });
    } catch (error) {
        console.error("Get application detail error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// PUT /api/hono/admin/applications/:id/company-data (Update/Create Company Data)
app.put("/admin/applications/:id/company-data", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const applicationId = c.req.param("id");
        const body = await c.req.json();

        const companyData = await prisma.companyData.upsert({
            where: { applicationId },
            update: {
                emailPerusahaan: body.emailPerusahaan,
                emailPassword: body.emailPassword,
                akunOss: body.akunOss,
                akunOssPassword: body.akunOssPassword,
            },
            create: {
                applicationId,
                emailPerusahaan: body.emailPerusahaan,
                emailPassword: body.emailPassword,
                akunOss: body.akunOss,
                akunOssPassword: body.akunOssPassword,
            },
        });

        return c.json({ companyData });
    } catch (error) {
        console.error("Update company data error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// POST /api/hono/admin/company-data/:id/directors (Add Director)
app.post("/admin/company-data/:id/directors", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const companyDataId = c.req.param("id");
        const body = await c.req.json();

        const director = await prisma.director.create({
            data: {
                companyDataId,
                name: body.name,
                jabatan: body.jabatan,
                masaJabatan: body.masaJabatan,
                akhirMenjabat: body.akhirMenjabat ? new Date(body.akhirMenjabat) : null,
                status: body.status || "Aktif",
            },
        });

        return c.json({ director });
    } catch (error) {
        return c.json({ error: "Gagal menambah direktur" }, 500);
    }
});

// DELETE /api/hono/admin/directors/:id
app.delete("/admin/directors/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }
        await prisma.director.delete({ where: { id: c.req.param("id") } });
        return c.json({ success: true });
    } catch (error) {
        return c.json({ error: "Gagal menghapus direktur" }, 500);
    }
});

// POST /api/hono/admin/company-data/:id/agreements (Add Agreement)
app.post("/admin/company-data/:id/agreements", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const companyDataId = c.req.param("id");
        const body = await c.req.json();

        const agreement = await prisma.agreement.create({
            data: {
                companyDataId,
                title: body.title,
                validUntil: body.validUntil ? new Date(body.validUntil) : null,
                status: body.status || "Aktif",
            },
        });

        return c.json({ agreement });
    } catch (error) {
        return c.json({ error: "Gagal menambah perjanjian" }, 500);
    }
});

// DELETE /api/hono/admin/agreements/:id
app.delete("/admin/agreements/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }
        await prisma.agreement.delete({ where: { id: c.req.param("id") } });
        return c.json({ success: true });
    } catch (error) {
        return c.json({ error: "Gagal menghapus perjanjian" }, 500);
    }
});

// POST /api/hono/admin/company-data/:id/tax-reports (Add Tax Report)
app.post("/admin/company-data/:id/tax-reports", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const companyDataId = c.req.param("id");
        const body = await c.req.json();

        const report = await prisma.taxReport.create({
            data: {
                companyDataId,
                title: body.title,
                description: body.description,
                status: body.status || "BELUM LAPOR",
                date: body.date ? new Date(body.date) : new Date(),
            },
        });

        return c.json({ report });
    } catch (error) {
        return c.json({ error: "Gagal menambah laporan pajak" }, 500);
    }
});

// DELETE /api/hono/admin/tax-reports/:id
app.delete("/admin/tax-reports/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }
        await prisma.taxReport.delete({ where: { id: c.req.param("id") } });
        return c.json({ success: true });
    } catch (error) {
        return c.json({ error: "Gagal menghapus laporan pajak" }, 500);
    }
});

// ==========================================
// APPLICATION DOCUMENTS (Admin Only)
// ==========================================

// POST /api/hono/admin/applications/:id/documents
app.post("/admin/applications/:id/documents", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const applicationId = c.req.param("id");
        const body = await c.req.json();
        const docName = body.name || "";
        const fileUrl = body.link || "";
        const category = body.category || "";
        const adminNote = body.adminNote || "";
        const documentNumber = body.documentNumber || "";

        if (!fileUrl) return c.json({ error: "Link Google Drive harus diisi" }, 400);

        const doc = await prisma.applicationDocument.create({
            data: {
                applicationId,
                name: docName || "Dokumen",
                fileUrl: fileUrl,
                fileSize: 0,
                fileType: "link",
                category: category || null,
                adminNote: adminNote || null,
                documentNumber: documentNumber || null,
            },
        });

        return c.json({ document: doc }, 201);
    } catch (error) {
        console.error("Upload app doc error:", error);
        return c.json({ error: "Terjadi kesalahan saat upload" }, 500);
    }
});

// DELETE /api/hono/admin/applications/:id/documents/:docId
app.delete("/admin/applications/:id/documents/:docId", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const docId = c.req.param("docId");

        const doc = await prisma.applicationDocument.findUnique({ where: { id: docId } });
        if (!doc) return c.json({ error: "Dokumen tidak ditemukan" }, 404);

        // Delete from local storage only if it's not a link
        if (doc.fileType !== "link" && doc.fileUrl.includes(BUCKET_LEGAL_DOCS)) {
            const filePath = extractPathFromUrl(doc.fileUrl, BUCKET_LEGAL_DOCS);
            if (filePath) {
                await removeFiles(BUCKET_LEGAL_DOCS, [filePath]);
            }
        }

        await prisma.applicationDocument.delete({ where: { id: docId } });

        return c.json({ message: "Dokumen berhasil dihapus" });
    } catch (error) {
        console.error("Delete app doc error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// ==========================================
// USER DOCUMENTS (User self-service)
// ==========================================

// GET /api/hono/user-documents
app.get("/user-documents", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const documents = await prisma.userDocument.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { storageUsed: true, storageLimit: true, isPro: true },
        });

        return c.json({
            documents,
            storage: {
                used: Number(user?.storageUsed || 0),
                limit: Number(user?.storageLimit || 52428800),
                isPro: user?.isPro || false,
            },
        });
    } catch (error) {
        console.error("Get user docs error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// POST /api/hono/user-documents
app.post("/user-documents", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const formData = await c.req.formData();
        const file = formData.get("file") as File | null;

        if (!file) return c.json({ error: "File harus diupload" }, 400);
        if (file.size > MAX_FILE_SIZE) {
            return c.json({ error: "Ukuran file maksimal 5MB per file" }, 400);
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return c.json({ error: "Format file tidak didukung. Gunakan PDF, JPG, PNG, atau DOC/DOCX" }, 400);
        }

        // Check storage quota
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { storageUsed: true, storageLimit: true },
        });

        if (!user) return c.json({ error: "User tidak ditemukan" }, 404);

        const storageUsed = Number(user.storageUsed);
        const storageLimit = Number(user.storageLimit);

        if (storageUsed + file.size > storageLimit) {
            return c.json({
                error: "Penyimpanan penuh. Hapus beberapa dokumen atau upgrade ke Pro untuk menambah kapasitas.",
                code: "STORAGE_FULL",
            }, 403);
        }

        // Upload to local storage
        const fileName = `${session.user.id}/${Date.now()}-${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await uploadFile(
            BUCKET_USER_VAULT,
            fileName,
            arrayBuffer,
            file.type
        );

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return c.json({ error: "Gagal mengunggah file: " + uploadError.message }, 500);
        }

        const publicUrl = getPublicUrl(BUCKET_USER_VAULT, fileName);

        // Save document record + update storage used
        const [doc] = await prisma.$transaction([
            prisma.userDocument.create({
                data: {
                    userId: session.user.id,
                    name: file.name,
                    fileUrl: publicUrl,
                    fileSize: file.size,
                    fileType: file.type,
                },
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: { storageUsed: { increment: file.size } },
            }),
        ]);

        return c.json({ document: doc }, 201);
    } catch (error) {
        console.error("Upload user doc error:", error);
        return c.json({ error: "Terjadi kesalahan saat upload" }, 500);
    }
});

// DELETE /api/hono/user-documents/:id
app.delete("/user-documents/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const docId = c.req.param("id");

        const doc = await prisma.userDocument.findFirst({
            where: { id: docId, userId: session.user.id },
        });

        if (!doc) return c.json({ error: "Dokumen tidak ditemukan" }, 404);

        // Delete from local storage
        const filePath = extractPathFromUrl(doc.fileUrl, BUCKET_USER_VAULT);
        if (filePath) {
            await removeFiles(BUCKET_USER_VAULT, [filePath]);
        }

        // Delete record + decrement storage
        await prisma.$transaction([
            prisma.userDocument.delete({ where: { id: docId } }),
            prisma.user.update({
                where: { id: session.user.id },
                data: { storageUsed: { decrement: doc.fileSize } },
            }),
        ]);

        return c.json({ message: "Dokumen berhasil dihapus" });
    } catch (error) {
        console.error("Delete user doc error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// ==========================================
// USER STORAGE INFO
// ==========================================
app.get("/user-storage", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { storageUsed: true, storageLimit: true, isPro: true },
        });

        return c.json({
            used: Number(user?.storageUsed || 0),
            limit: Number(user?.storageLimit || 52428800),
            isPro: user?.isPro || false,
        });
    } catch (error) {
        console.error("Get storage info error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// ==========================================
// ADMIN: Get user detail with applications
// ==========================================
app.get("/admin/users/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const userId = c.req.param("id");
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                alamat: true,
                telepon: true,
                storageUsed: true,
                storageLimit: true,
                isPro: true,
                createdAt: true,
                applications: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        service: true,
                        documents: { orderBy: { createdAt: "desc" } },
                    },
                },
            },
        });

        if (!user) return c.json({ error: "User tidak ditemukan" }, 404);

        return c.json({
            user: {
                ...user,
                storageUsed: Number(user.storageUsed),
                storageLimit: Number(user.storageLimit),
            },
        });
    } catch (error) {
        console.error("Get user detail error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// ==========================================
// COMPANY LOGO (User self-service)
// ==========================================

// GET /api/hono/company-logo
app.get("/company-logo", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { companyLogo: true },
        });

        return c.json({ companyLogo: user?.companyLogo || null });
    } catch (error) {
        console.error("Get company logo error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// POST /api/hono/company-logo
app.post("/company-logo", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const formData = await c.req.formData();
        const file = formData.get("file") as File | null;

        if (!file) return c.json({ error: "File harus diupload" }, 400);

        // Only allow image types
        const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedImageTypes.includes(file.type)) {
            return c.json({ error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP" }, 400);
        }

        // Max 2MB for logo
        const maxLogoSize = 2 * 1024 * 1024;
        if (file.size > maxLogoSize) {
            return c.json({ error: "Ukuran logo maksimal 2MB" }, 400);
        }

        // Delete old logo from local storage if exists
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { companyLogo: true },
        });

        if (currentUser?.companyLogo) {
            const oldPath = extractPathFromUrl(currentUser.companyLogo, BUCKET_USER_VAULT);
            if (oldPath) {
                await removeFiles(BUCKET_USER_VAULT, [oldPath]);
            }
        }

        // Upload to local storage
        const ext = file.name.split(".").pop()?.toLowerCase() || "png";
        const fileName = `${session.user.id}/company-logo-${Date.now()}.${ext}`;
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await uploadFile(
            BUCKET_USER_VAULT,
            fileName,
            arrayBuffer,
            file.type
        );

        if (uploadError) {
            console.error("Upload logo error:", uploadError);
            return c.json({ error: "Gagal mengunggah logo: " + uploadError.message }, 500);
        }

        const logoUrl = getPublicUrl(BUCKET_USER_VAULT, fileName);

        // Update user record
        await prisma.user.update({
            where: { id: session.user.id },
            data: { companyLogo: logoUrl },
        });

        return c.json({ companyLogo: logoUrl }, 201);
    } catch (error) {
        console.error("Upload company logo error:", error);
        return c.json({ error: "Terjadi kesalahan saat upload logo" }, 500);
    }
});

// DELETE /api/hono/company-logo
app.delete("/company-logo", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { companyLogo: true },
        });

        if (user?.companyLogo) {
            const logoPath = extractPathFromUrl(user.companyLogo, BUCKET_USER_VAULT);
            if (logoPath) {
                await removeFiles(BUCKET_USER_VAULT, [logoPath]);
            }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { companyLogo: null },
        });

        return c.json({ message: "Logo berhasil dihapus" });
    } catch (error) {
        console.error("Delete company logo error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// ==========================================
// REMINDERS MANAGEMENT
// ==========================================

// GET /api/hono/reminders (User: own reminders with calculated remaining days)
app.get("/reminders", async (c) => {
    try {
        const session = await auth();
        if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

        const reminders = await prisma.reminder.findMany({
            where: { userId: session.user.id },
            orderBy: { dueDate: "asc" },
        });

        // Calculate remaining days and status color
        const now = new Date();
        const enrichedReminders = reminders.map((r) => {
            const diffMs = new Date(r.dueDate).getTime() - now.getTime();
            const remaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
            let status = "emerald";
            if (remaining <= 5) status = "red";
            else if (remaining <= 30) status = "amber";
            return {
                ...r,
                remaining,
                status,
            };
        });

        return c.json({ reminders: enrichedReminders });
    } catch (error) {
        console.error("Get reminders error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// GET /api/hono/admin/reminders (Admin: all or by userId)
app.get("/admin/reminders", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const userId = c.req.query("userId");
        const where = userId ? { userId } : {};

        const reminders = await prisma.reminder.findMany({
            where,
            orderBy: { dueDate: "asc" },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });

        return c.json({ reminders });
    } catch (error) {
        console.error("Admin get reminders error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// POST /api/hono/admin/reminders (Admin: create reminder for user)
app.post("/admin/reminders", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const { userId, title, type, dueDate, icon } = await c.req.json();

        if (!userId || !title || !dueDate) {
            return c.json({ error: "userId, title, dan dueDate harus diisi" }, 400);
        }

        // Verify user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return c.json({ error: "User tidak ditemukan" }, 404);

        const reminder = await prisma.reminder.create({
            data: {
                userId,
                title,
                type: type || "task",
                dueDate: new Date(dueDate),
                icon: icon || "notifications",
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });

        return c.json({ reminder }, 201);
    } catch (error) {
        console.error("Create reminder error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// PATCH /api/hono/admin/reminders/:id (Admin: update reminder)
app.patch("/admin/reminders/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const id = c.req.param("id");
        const body = await c.req.json();

        const reminder = await prisma.reminder.update({
            where: { id },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.type && { type: body.type }),
                ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
                ...(body.icon && { icon: body.icon }),
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });

        return c.json({ reminder });
    } catch (error) {
        console.error("Update reminder error:", error);
        return c.json({ error: "Terjadi kesalahan" }, 500);
    }
});

// DELETE /api/hono/admin/reminders/:id (Admin: delete reminder)
app.delete("/admin/reminders/:id", async (c) => {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "SUPER_ADMIN") {
            return c.json({ error: "Unauthorized" }, 403);
        }

        await prisma.reminder.delete({ where: { id: c.req.param("id") } });
        return c.json({ message: "Pengingat berhasil dihapus" });
    } catch (error) {
        console.error("Delete reminder error:", error);
        return c.json({ error: "Gagal menghapus pengingat" }, 500);
    }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
