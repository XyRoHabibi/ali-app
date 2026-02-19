import { Hono } from "hono";
import { handle } from "hono/vercel";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";

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

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
