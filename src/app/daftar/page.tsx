"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    MapPin,
    Phone,
    ArrowRight,
    Shield,
    CheckCircle2,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

export default function DaftarPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        alamat: "",
        telepon: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);

    const passwordChecks = {
        length: form.password.length >= 8,
        match:
            form.confirmPassword.length > 0 &&
            form.password === form.confirmPassword,
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Password dan konfirmasi password tidak sama");
            return;
        }

        if (form.password.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }

        if (!captchaValue) {
            setError("Harap verifikasi captcha terlebih dahulu");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/hono/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, recaptchaToken: captchaValue }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Terjadi kesalahan saat registrasi");
                return;
            }

            // Auto login after registration
            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                recaptchaToken: captchaValue,
                redirect: false,
            });

            if (result?.error) {
                router.push("/masuk");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Terjadi kesalahan, silakan coba lagi");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full pl-12 pr-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] transition-all duration-200";

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7ff] via-white to-[#fef9ee]" />
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#2a6ba7]/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f3b444]/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4" />

            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-[#2a6ba7] to-[#1a2c3d] items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
                </div>
                <div className="relative z-10 text-white max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <Image src="/images/logo-putih.png" alt="Logo" width={150} height={150} />
                    </div>
                    <h1 className="text-4xl font-[family-name:var(--font-heading)] font-bold mb-6 leading-tight">
                        Mulai Perjalanan Legalitas Bisnis{" "}
                        <span className="text-[#f3b444]">Anda</span>
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        Daftarkan akun Anda dan nikmati kemudahan pengurusan legalitas
                        bisnis secara digital.
                    </p>
                    <div className="space-y-4">
                        {[
                            "Proses pendaftaran cepat & mudah",
                            "Dashboard monitoring real-time",
                            "Dokumen legal terorganisir",
                            "Dukungan tim ahli profesional",
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

            {/* Right side - Register Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-8 relative z-10">
                <div className="w-full max-w-lg">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
                        <Image src="/images/logo-color.png" alt="Logo" width={150} height={150} />
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] font-bold text-[#111827] mb-2">
                            Buat Akun Baru
                        </h2>
                        <p className="text-[#6b7280]">
                            Isi formulir di bawah untuk mendaftar
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                                Alamat
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#9ca3af]" />
                                <textarea
                                    name="alamat"
                                    rows={2}
                                    value={form.alamat}
                                    onChange={handleChange}
                                    placeholder="Masukkan alamat lengkap"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] transition-all duration-200 resize-none"
                                />
                            </div>
                        </div>

                        {/* No Telepon */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                                No. Telepon
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type="tel"
                                    name="telepon"
                                    value={form.telepon}
                                    onChange={handleChange}
                                    placeholder="0812xxxxxxxx"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="nama@email.com"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
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

                        {/* Ulangi Password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                                Ulangi Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Ulangi password"
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
                                        {passwordChecks.match ? "Password cocok" : "Password tidak cocok"}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-center my-2">
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                                onChange={(val) => setCaptchaValue(val)}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#2a6ba7] hover:bg-[#235d94] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#2a6ba7]/20 hover:shadow-xl hover:shadow-[#2a6ba7]/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[#6b7280]">
                        Sudah punya akun?{" "}
                        <Link
                            href="/masuk"
                            className="text-[#2a6ba7] hover:text-[#1e5a8a] font-semibold transition-colors"
                        >
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
