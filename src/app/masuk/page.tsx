"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";

export default function MasukPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email atau password salah");
            } else {
                // Check role to determine redirect
                const sessionRes = await fetch("/api/auth/session");
                const session = await sessionRes.json();

                if (session?.user?.role === "SUPER_ADMIN") {
                    router.push("/super-admin");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            }
        } catch {
            setError("Terjadi kesalahan, silakan coba lagi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7ff] via-white to-[#fef9ee]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2a6ba7]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f3b444]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#2a6ba7] to-[#1a2c3d] items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
                </div>
                <div className="relative z-10 text-white max-w-lg">
                    <div className="flex items-center gap-3 mb-1">

                        <Image src="/images/logo-putih.png" alt="Logo" width={150} height={150} />
                    </div>
                    <h1 className="text-4xl font-[family-name:var(--font-heading)] font-bold mb-6 leading-tight">
                        Pantau Legalitas Bisnis Anda Secara{" "}
                        <span className="text-[#f3b444]">Real-Time</span>
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        Akses dashboard digital untuk tracking permohonan, dokumen legal,
                        dan status layanan Anda kapan saja, di mana saja.
                    </p>
                    <div className="space-y-4">
                        {[
                            "Tracking permohonan real-time",
                            "Manajemen dokumen legal digital",
                            "Notifikasi update status otomatis",
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-[#f3b444]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 bg-[#f3b444] rounded-full" />
                                </div>
                                <span className="text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <Image src="/images/logo-color.png" alt="Logo" width={150} height={150} />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] font-bold text-[#111827] mb-2">
                            Selamat Datang Kembali
                        </h2>
                        <p className="text-[#6b7280]">
                            Masuk ke dashboard Anda untuk melanjutkan
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
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
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                    placeholder="nama@email.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-[#374151]">
                                    Password
                                </label>
                                <Link
                                    href="/lupa-password"
                                    className="text-sm text-[#2a6ba7] hover:text-[#1e5a8a] font-medium transition-colors"
                                >
                                    Lupa Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                    placeholder="Masukkan password"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#2a6ba7] hover:bg-[#235d94] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#2a6ba7]/20 hover:shadow-xl hover:shadow-[#2a6ba7]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Masuk
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[#6b7280]">
                        Belum punya akun?{" "}
                        <Link
                            href="/daftar"
                            className="text-[#2a6ba7] hover:text-[#1e5a8a] font-semibold transition-colors"
                        >
                            Daftar Sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
