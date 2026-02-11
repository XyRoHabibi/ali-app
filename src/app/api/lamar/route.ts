import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const namaLengkap = formData.get("namaLengkap") as string;
        const email = formData.get("email") as string;
        const noTelepon = formData.get("noTelepon") as string;
        const posisi = formData.get("posisi") as string;
        const pengalaman = formData.get("pengalaman") as string;
        const pendidikan = formData.get("pendidikan") as string;
        const pesan = formData.get("pesan") as string;
        const cvFile = formData.get("cv") as File | null;

        // Validate required fields
        if (!namaLengkap || !email || !noTelepon || !posisi) {
            return NextResponse.json(
                { error: "Harap isi semua field yang wajib diisi." },
                { status: 400 }
            );
        }

        // Prepare CV attachment
        let attachments: { filename: string; content: Buffer }[] = [];
        if (cvFile) {
            const bytes = await cvFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            attachments = [
                {
                    filename: cvFile.name,
                    content: buffer,
                },
            ];
        }

        // Configure SMTP transporter
        // Uses environment variables for security
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || "",
                pass: process.env.SMTP_PASS || "",
            },
        });

        // Email HTML template
        const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 0;">
            <div style="background: linear-gradient(135deg, #2a6ba7 0%, #1e5a8f 50%, #1a2c3d 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">📩 Lamaran Kerja Baru</h1>
                <p style="color: #f3b444; margin: 8px 0 0 0; font-size: 16px; font-weight: 600;">Posisi: ${posisi}</p>
            </div>
            
            <div style="padding: 30px;">
                <div style="background: #ffffff; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    <h2 style="color: #2a6ba7; font-size: 16px; margin: 0 0 16px 0; border-bottom: 2px solid #f3b444; padding-bottom: 8px;">👤 Data Pelamar</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Nama Lengkap</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${namaLengkap}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
                                <a href="mailto:${email}" style="color: #2a6ba7; text-decoration: none;">${email}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">No. Telepon</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${noTelepon}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pengalaman</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${pengalaman || "-"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pendidikan</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${pendidikan || "-"}</td>
                        </tr>
                    </table>
                </div>

                ${pesan ? `
                <div style="background: #ffffff; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    <h2 style="color: #2a6ba7; font-size: 16px; margin: 0 0 12px 0; border-bottom: 2px solid #f3b444; padding-bottom: 8px;">💬 Pesan / Cover Letter</h2>
                    <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${pesan}</p>
                </div>
                ` : ""}

                ${cvFile ? `
                <div style="background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    <h2 style="color: #2a6ba7; font-size: 16px; margin: 0 0 12px 0; border-bottom: 2px solid #f3b444; padding-bottom: 8px;">📎 Lampiran CV</h2>
                    <p style="color: #374151; font-size: 14px; margin: 0;">File: <strong>${cvFile.name}</strong></p>
                </div>
                ` : ""}
            </div>

            <div style="text-align: center; padding: 20px 30px 30px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">Email ini dikirim otomatis dari website Akses Legal Indonesia</p>
            </div>
        </div>
        `;

        // Send email
        await transporter.sendMail({
            from: `"Akses Legal Karir" <${process.env.SMTP_USER || "noreply@akseslegal.id"}>`,
            to: process.env.CAREER_EMAIL || "career@akseslegal.id",
            replyTo: email,
            subject: `[Lamaran Kerja] ${posisi} - ${namaLengkap}`,
            html: htmlContent,
            attachments,
        });

        return NextResponse.json(
            { message: "Lamaran berhasil dikirim!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending application:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi." },
            { status: 500 }
        );
    }
}
