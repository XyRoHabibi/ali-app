"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Shield, Send, CheckCircle } from "lucide-react";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";

export default function LupaPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!captchaValue) {
            setError("Harap verifikasi captcha terlebih dahulu");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/hono/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, recaptchaToken: captchaValue }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Terjadi kesalahan");
                return;
            }

            setSent(true);
        } catch {
            setError("Terjadi kesalahan, silakan coba lagi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7ff] via-white to-[#fef9ee]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2a6ba7]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f3b444]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <Image src="/images/logo-color.png" alt="Logo" width={150} height={150} />
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-[#2a6ba7]/5 p-8">
                    {sent ? (
                        /* Success State */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#111827] mb-3">
                                Email Terkirim!
                            </h2>
                            <p className="text-[#6b7280] mb-6 leading-relaxed">
                                Jika email <strong className="text-[#374151]">{email}</strong>{" "}
                                terdaftar di sistem kami, Anda akan menerima link untuk mereset
                                password. Silakan cek inbox dan folder spam Anda.
                            </p>
                            <Link
                                href="/masuk"
                                className="inline-flex items-center gap-2 text-[#2a6ba7] hover:text-[#1e5a8a] font-semibold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke halaman masuk
                            </Link>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-[#2a6ba7]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <Mail className="w-8 h-8 text-[#2a6ba7]" />
                                </div>
                                <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#111827] mb-2">
                                    Lupa Password?
                                </h2>
                                <p className="text-[#6b7280]">
                                    Masukkan email Anda dan kami akan mengirimkan link untuk
                                    mereset password
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-[#374151] mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nama@email.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center my-2">
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                                        onChange={(val) => setCaptchaValue(val)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-[#2a6ba7] hover:bg-[#235d94] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#2a6ba7]/20 hover:shadow-xl hover:shadow-[#2a6ba7]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Kirim Link Reset
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/masuk"
                                    className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#2a6ba7] font-medium transition-colors text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke halaman masuk
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
