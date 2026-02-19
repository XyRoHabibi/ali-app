"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Lock,
    Eye,
    EyeOff,
    Shield,
    CheckCircle,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const passwordChecks = {
        length: form.password.length >= 8,
        match:
            form.confirmPassword.length > 0 &&
            form.password === form.confirmPassword,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Password dan konfirmasi password tidak sama");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/hono/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Terjadi kesalahan");
                return;
            }

            setSuccess(true);
        } catch {
            setError("Terjadi kesalahan, silakan coba lagi");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-[#2a6ba7]/5 p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#111827] mb-3">
                    Link Tidak Valid
                </h2>
                <p className="text-[#6b7280] mb-6">
                    Link reset password tidak valid atau sudah kadaluarsa. Silakan minta
                    link baru.
                </p>
                <Link
                    href="/lupa-password"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a6ba7] text-white font-semibold rounded-xl hover:bg-[#235d94] transition-colors"
                >
                    Minta Link Baru
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-[#2a6ba7]/5 p-8">
            {success ? (
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#111827] mb-3">
                        Password Berhasil Diubah!
                    </h2>
                    <p className="text-[#6b7280] mb-6">
                        Password Anda telah berhasil diubah. Silakan masuk dengan password
                        baru Anda.
                    </p>
                    <Link
                        href="/masuk"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a6ba7] text-white font-semibold rounded-xl hover:bg-[#235d94] transition-colors shadow-lg shadow-[#2a6ba7]/20"
                    >
                        Masuk Sekarang
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#2a6ba7]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Lock className="w-8 h-8 text-[#2a6ba7]" />
                        </div>
                        <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#111827] mb-2">
                            Buat Password Baru
                        </h2>
                        <p className="text-[#6b7280]">
                            Masukkan password baru untuk akun Anda
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
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2">
                                Password Baru
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                    placeholder="Minimal 8 karakter"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2">
                                Konfirmasi Password Baru
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={form.confirmPassword}
                                    onChange={(e) =>
                                        setForm({ ...form, confirmPassword: e.target.value })
                                    }
                                    placeholder="Ulangi password baru"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password checks */}
                        {form.password.length > 0 && (
                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
                                <div
                                    className={`flex items-center gap-1.5 ${passwordChecks.length ? "text-green-600" : "text-[#9ca3af]"}`}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Minimal 8 karakter
                                </div>
                                {form.confirmPassword.length > 0 && (
                                    <div
                                        className={`flex items-center gap-1.5 ${passwordChecks.match ? "text-green-600" : "text-red-500"}`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Password cocok
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#2a6ba7] hover:bg-[#235d94] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#2a6ba7]/20 hover:shadow-xl hover:shadow-[#2a6ba7]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Ubah Password
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7ff] via-white to-[#fef9ee]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2a6ba7]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f3b444]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <Image src="/images/logo-color.png" alt="Logo" width={50} height={50} />
                </div>

                <Suspense
                    fallback={
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-8 text-center">
                            <div className="w-8 h-8 border-2 border-[#2a6ba7]/30 border-t-[#2a6ba7] rounded-full animate-spin mx-auto" />
                        </div>
                    }
                >
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
