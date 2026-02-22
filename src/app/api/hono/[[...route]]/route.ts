import { Hono } from "hono";
import { handle } from "hono/vercel";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
import {
    supabaseAdmin,
    BUCKET_LEGAL_DOCS,
    BUCKET_USER_VAULT,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
} from "@/lib/supabase";

const app = new Hono().basePath("/api/hono");

// ==========================================
// POST /api/hono/register
// ==========================================
app.post("/register", async (c) => {
    try {
        const body = await c.req.json();
        const { name, email, password, confirmPassword, alamat, telepon } = body;

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
        const { email } = await c.req.json();

        if (!email) {
            return c.json({ error: "Email harus diisi" }, 400);
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
        const formData = await c.req.formData();
        const file = formData.get("file") as File | null;
        const docName = formData.get("name") as string || "";
        const category = formData.get("category") as string || "";
        const adminNote = formData.get("adminNote") as string || "";

        if (!file) return c.json({ error: "File harus diupload" }, 400);
        if (file.size > MAX_FILE_SIZE) {
            return c.json({ error: "Ukuran file maksimal 5MB" }, 400);
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return c.json({ error: "Format file tidak didukung" }, 400);
        }

        // Upload to Supabase Storage
        const fileName = `${applicationId}/${Date.now()}-${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET_LEGAL_DOCS)
            .upload(fileName, arrayBuffer, { contentType: file.type });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return c.json({ error: "Gagal mengunggah file: " + uploadError.message }, 500);
        }

        const { data: urlData } = supabaseAdmin.storage
            .from(BUCKET_LEGAL_DOCS)
            .getPublicUrl(fileName);

        const doc = await prisma.applicationDocument.create({
            data: {
                applicationId,
                name: docName || file.name,
                fileUrl: urlData.publicUrl,
                fileSize: file.size,
                fileType: file.type,
                category: category || null,
                adminNote: adminNote || null,
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

        // Delete from Supabase Storage
        const path = doc.fileUrl.split(`${BUCKET_LEGAL_DOCS}/`).pop();
        if (path) {
            await supabaseAdmin.storage.from(BUCKET_LEGAL_DOCS).remove([path]);
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

        // Upload to Supabase Storage
        const fileName = `${session.user.id}/${Date.now()}-${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET_USER_VAULT)
            .upload(fileName, arrayBuffer, { contentType: file.type });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return c.json({ error: "Gagal mengunggah file: " + uploadError.message }, 500);
        }

        const { data: urlData } = supabaseAdmin.storage
            .from(BUCKET_USER_VAULT)
            .getPublicUrl(fileName);

        // Save document record + update storage used
        const [doc] = await prisma.$transaction([
            prisma.userDocument.create({
                data: {
                    userId: session.user.id,
                    name: file.name,
                    fileUrl: urlData.publicUrl,
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

        // Delete from Supabase Storage
        const path = doc.fileUrl.split(`${BUCKET_USER_VAULT}/`).pop();
        if (path) {
            await supabaseAdmin.storage.from(BUCKET_USER_VAULT).remove([path]);
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

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
