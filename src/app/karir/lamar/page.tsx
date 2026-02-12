"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

// Job positions data (same as karir page for title matching)
const jobPositions: Record<string, { title: string; icon: string; gradient: string }> = {
    "1": { title: "Legal Consultant", icon: "support_agent", gradient: "from-[#2a6ba7] to-blue-600" },
    "2": { title: "Digital Marketing Specialist", icon: "campaign", gradient: "from-[#f3b444] to-orange-500" },
    "3": { title: "Frontend Developer", icon: "code", gradient: "from-purple-500 to-violet-600" },
    "4": { title: "Customer Success Officer", icon: "headset_mic", gradient: "from-green-500 to-emerald-600" },
    "5": { title: "Legal Research Intern", icon: "menu_book", gradient: "from-amber-500 to-orange-600" },
    "6": { title: "Social Media Intern", icon: "share", gradient: "from-pink-500 to-rose-600" },
    "7": { title: "Admin & Data Entry Intern", icon: "edit_document", gradient: "from-cyan-500 to-teal-600" },
};

type FormStatus = "idle" | "loading" | "success" | "error";

function LamarForm() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get("posisi") || "1";
    const job = jobPositions[jobId] || jobPositions["1"];

    const sectionRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formStatus, setFormStatus] = useState<FormStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [fileName, setFileName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    // Form fields
    const [namaLengkap, setNamaLengkap] = useState("");
    const [email, setEmail] = useState("");
    const [noTelepon, setNoTelepon] = useState("");
    const [pengalaman, setPengalaman] = useState("");
    const [pendidikan, setPendidikan] = useState("");
    const [pesan, setPesan] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const revealElements = sectionRef.current?.querySelectorAll(".reveal-up");
        revealElements?.forEach((el) => observer.observe(el));

        setTimeout(() => {
            revealElements?.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add("active");
                }
            });
        }, 100);

        return () => observer.disconnect();
    }, []);

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage("Format file tidak didukung. Gunakan PDF, DOC, atau DOCX.");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("Ukuran file maksimal 5MB.");
            return;
        }

        setCvFile(file);
        setFileName(file.name);
        setErrorMessage("");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        handleFileChange(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("loading");
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("namaLengkap", namaLengkap);
            formData.append("email", email);
            formData.append("noTelepon", noTelepon);
            formData.append("posisi", job.title);
            formData.append("pengalaman", pengalaman);
            formData.append("pendidikan", pendidikan);
            formData.append("pesan", pesan);
            if (cvFile) {
                formData.append("cv", cvFile);
            }

            const response = await fetch("/api/lamar", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Terjadi kesalahan");
            }

            setFormStatus("success");
        } catch (err) {
            setFormStatus("error");
            setErrorMessage(
                err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim lamaran."
            );
        }
    };

    // Success state
    if (formStatus === "success") {
        return (
            <div ref={sectionRef}>
                <main className="relative">
                    {/* Hero Header */}
                    <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#2a6ba7] via-[#1e5a8f] to-[#1a2c3d] text-white overflow-hidden px-6">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                            <div className="absolute top-20 left-10 w-72 h-72 bg-[#f3b444]/20 rounded-full blur-[100px] animate-float"></div>
                            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2a6ba7]/30 rounded-full blur-[120px]"></div>
                        </div>
                        <div className="max-w-[800px] mx-auto relative z-10 text-center">
                            <Link
                                href="/karir"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 hover:bg-white/20 transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Kembali ke Karir
                            </Link>
                        </div>
                    </section>

                    {/* Success Content */}
                    <section className="py-20 px-6">
                        <div className="max-w-[600px] mx-auto text-center reveal-up">
                            <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-gray-100">
                                <div className="size-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-8">
                                    <span className="material-symbols-outlined text-5xl text-green-600">
                                        check_circle
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4">
                                    Lamaran Terkirim! 🎉
                                </h2>
                                <p className="text-gray-500 text-lg mb-3 font-medium">
                                    Terima kasih <span className="text-[#2a6ba7] font-bold">{namaLengkap}</span>, lamaran Anda untuk posisi
                                </p>
                                <p className="text-[#2a6ba7] text-xl font-black mb-6">{job.title}</p>
                                <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                                    telah berhasil dikirim. Tim kami akan meninjau lamaran Anda dan menghubungi melalui email <span className="font-semibold text-gray-600">{email}</span> jika profil Anda sesuai.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/karir"
                                        className="h-14 px-8 bg-[#2a6ba7] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2a6ba7]/90 hover:shadow-xl hover:shadow-[#2a6ba7]/30 transition-all"
                                    >
                                        <span className="material-symbols-outlined">arrow_back</span>
                                        Kembali ke Karir
                                    </Link>
                                    <Link
                                        href="/"
                                        className="h-14 px-8 bg-gray-100 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                                    >
                                        <span className="material-symbols-outlined">home</span>
                                        Halaman Utama
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div ref={sectionRef}>
            <main className="relative">
                {/* Hero Header */}
                <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#2a6ba7] via-[#1e5a8f] to-[#1a2c3d] text-white overflow-hidden px-6">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        <div className="absolute top-20 left-10 w-72 h-72 bg-[#f3b444]/20 rounded-full blur-[100px] animate-float"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2a6ba7]/30 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="max-w-[800px] mx-auto relative z-10">
                        <Link
                            href="/karir"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-8 hover:bg-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Kembali ke Karir
                        </Link>

                        <div className="flex items-center gap-5 mb-6 reveal-up">
                            <div
                                className={`size-16 shrink-0 rounded-2xl bg-gradient-to-br ${job.gradient} text-white flex items-center justify-center shadow-lg`}
                            >
                                <span className="material-symbols-outlined text-2xl">{job.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">
                                    Melamar untuk posisi
                                </p>
                                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                                    {job.title}
                                </h1>
                            </div>
                        </div>
                        <p className="text-white/70 font-medium reveal-up" style={{ transitionDelay: "100ms" }}>
                            Isi formulir di bawah ini dengan lengkap dan upload CV terbaru Anda.
                        </p>
                    </div>

                    {/* Decorative Logo */}
                    <div className="absolute right-0 top-0 opacity-5 translate-x-1/4 -translate-y-1/4">
                        <Image
                            src="/images/logo-putih.png"
                            alt=""
                            width={400}
                            height={200}
                            className="w-[400px] h-auto"
                        />
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-12 md:py-20 px-6">
                    <div className="max-w-[800px] mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information Card */}
                            <div className="reveal-up bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-xl bg-[#2a6ba7]/10 text-[#2a6ba7] flex items-center justify-center">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900">Data Diri</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Nama Lengkap */}
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="namaLengkap"
                                            className="block text-sm font-bold text-gray-700 mb-2"
                                        >
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="namaLengkap"
                                            value={namaLengkap}
                                            onChange={(e) => setNamaLengkap(e.target.value)}
                                            required
                                            placeholder="Masukkan nama lengkap Anda"
                                            className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 font-medium placeholder:text-gray-400 focus:border-[#2a6ba7] focus:ring-4 focus:ring-[#2a6ba7]/10 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-bold text-gray-700 mb-2"
                                        >
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="email@contoh.com"
                                            className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 font-medium placeholder:text-gray-400 focus:border-[#2a6ba7] focus:ring-4 focus:ring-[#2a6ba7]/10 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    {/* No. Telepon */}
                                    <div>
                                        <label
                                            htmlFor="noTelepon"
                                            className="block text-sm font-bold text-gray-700 mb-2"
                                        >
                                            No. Telepon / WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="noTelepon"
                                            value={noTelepon}
                                            onChange={(e) => setNoTelepon(e.target.value)}
                                            required
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 font-medium placeholder:text-gray-400 focus:border-[#2a6ba7] focus:ring-4 focus:ring-[#2a6ba7]/10 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    {/* Pendidikan Terakhir */}
                                    <div>
                                        <label
                                            htmlFor="pendidikan"
                                            className="block text-sm font-bold text-gray-700 mb-2"
                                        >
                                            Pendidikan Terakhir
                                        </label>
                                        <select
                                            id="pendidikan"
                                            value={pendidikan}
                                            onChange={(e) => setPendidikan(e.target.value)}
                                            className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 font-medium focus:border-[#2a6ba7] focus:ring-4 focus:ring-[#2a6ba7]/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">Pilih pendidikan</option>
                                            <option value="SMA/SMK">SMA / SMK</option>
                                            <option value="D3">D3</option>
                                            <option value="S1">S1</option>
                                            <option value="S2">S2</option>
                                            <option value="S3">S3</option>
                                        </select>
                                    </div>

                                    {/* Pengalaman Kerja */}
                                    <div>
                                        <label
                                            htmlFor="pengalaman"
                                            className="block text-sm font-bold text-gray-700 mb-2"
                                        >
                                            Pengalaman Kerja
                                        </label>
                                        <select
                                            id="pengalaman"
                                            value={pengalaman}
                                            onChange={(e) => setPengalaman(e.target.value)}
                                            className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 font-medium focus:border-[#2a6ba7] focus:ring-4 focus:ring-[#2a6ba7]/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">Pilih pengalaman</option>
                                            <option value="Fresh Graduate">Fresh Graduate</option>
                                            <option value="< 1 Tahun">{"< 1 Tahun"}</option>
                                            <option value="1-2 Tahun">1-2 Tahun</option>
                                            <option value="2-5 Tahun">2-5 Tahun</option>
                                            <option value="5+ Tahun">5+ Tahun</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* CV Upload Card */}
                            <div
                                className="reveal-up bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100"
                                style={{ transitionDelay: "100ms" }}
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-xl bg-[#f3b444]/10 text-[#f3b444] flex items-center justify-center">
                                        <span className="material-symbols-outlined">upload_file</span>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900">Upload CV</h2>
                                </div>

                                {/* Drag & Drop Zone */}
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragActive(true);
                                    }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${dragActive
                                        ? "border-[#2a6ba7] bg-[#2a6ba7]/5 scale-[1.02]"
                                        : cvFile
                                            ? "border-green-400 bg-green-50"
                                            : "border-gray-300 bg-gray-50/50 hover:border-[#2a6ba7]/50 hover:bg-[#2a6ba7]/5"
                                        }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                    />

                                    {cvFile ? (
                                        <div className="space-y-3">
                                            <div className="size-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl text-green-600">
                                                    description
                                                </span>
                                            </div>
                                            <p className="text-green-700 font-bold text-lg">{fileName}</p>
                                            <p className="text-green-600 text-sm">
                                                {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCvFile(null);
                                                    setFileName("");
                                                }}
                                                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-bold hover:bg-red-200 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-base">close</span>
                                                Hapus File
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="size-16 mx-auto rounded-2xl bg-[#2a6ba7]/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl text-[#2a6ba7]">
                                                    cloud_upload
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-bold text-lg">
                                                    Drag & drop CV Anda di sini
                                                </p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    atau{" "}
                                                    <span className="text-[#2a6ba7] font-semibold underline">
                                                        klik untuk browse
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">
                                                        picture_as_pdf
                                                    </span>
                                                    PDF
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">
                                                        article
                                                    </span>
                                                    DOC / DOCX
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">
                                                        straighten
                                                    </span>
                                                    Max 5MB
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cover Letter Card */}
                            <div
                                className="reveal-up bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100"
                                style={{ transitionDelay: "200ms" }}
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined">edit_note</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">
                                            Pesan / Cover Letter
                                        </h2>
                                        <p className="text-xs text-gray-400 font-medium">Opsional</p>
                                    </div>
                                </div>

                                <textarea
                                    id="pesan"
                                    value={pesan}
                                    onChange={(e) => setPesan(e.target.value)}
                                    rows={6}
                                    placeholder="Ceritakan tentang diri Anda, mengapa Anda tertarik dengan posisi ini, dan apa yang membuat Anda cocok untuk peran ini..."
                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 font-medium placeholder:text-gray-400 focus:border-[#2a6ba7] focus:ring-4 focus:ring-[#2a6ba7]/10 focus:bg-white transition-all outline-none resize-none leading-relaxed"
                                />
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                                    <span className="material-symbols-outlined text-xl shrink-0">error</span>
                                    <p className="text-sm font-medium">{errorMessage}</p>
                                </div>
                            )}

                            {/* Submit Section */}
                            <div
                                className="reveal-up bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100"
                                style={{ transitionDelay: "300ms" }}
                            >
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#2a6ba7] text-xl mt-0.5 shrink-0">
                                            info
                                        </span>
                                        <p className="text-sm text-gray-500">
                                            Pastikan semua data yang Anda isi sudah benar. Lamaran akan dikirimkan langsung ke tim rekrutmen kami.
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={formStatus === "loading"}
                                        className={`shrink-0 w-full sm:w-auto h-14 px-10 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${formStatus === "loading"
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-[#2a6ba7] text-white shadow-lg shadow-[#2a6ba7]/30 hover:shadow-[#2a6ba7]/50 hover:-translate-y-1 active:translate-y-0 active:shadow-lg"
                                            }`}
                                    >
                                        {formStatus === "loading" ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">send</span>
                                                Kirim Lamaran
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function LamarPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex items-center gap-3 text-gray-400">
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="font-bold">Memuat formulir...</span>
                    </div>
                </div>
            }
        >
            <LamarForm />
        </Suspense>
    );
}
