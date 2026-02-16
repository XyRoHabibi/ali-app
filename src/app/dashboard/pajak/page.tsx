"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Sidebar navigation items — "Pelaporan Pajak" is active
const sidebarNavItems = [
    { href: "/dashboard", label: "Overview", icon: "dashboard", active: false },
    { href: "/dashboard/permohonan", label: "Permohonan Saya", icon: "description", active: false },
    { href: "/dashboard/dokumen", label: "Dokumen Legal", icon: "folder", active: false },
    { href: "/dashboard/harga", label: "Billing & Harga", icon: "payments", active: false },
    { href: "/dashboard/pajak", label: "Pelaporan Pajak", icon: "receipt_long", active: true },
];

// Tax type options
const taxTypes = [
    { value: "", label: "Pilih Jenis Pajak" },
    { value: "pph21", label: "PPh Pasal 21 - Pajak Penghasilan Karyawan" },
    { value: "pph23", label: "PPh Pasal 23 - Jasa & Royalti" },
    { value: "ppn", label: "PPN - Pajak Pertambahan Nilai" },
];

// Tax year options
const taxYears = ["2024", "2023", "2022"];

// Month options
const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Step definitions
const steps = [
    { icon: "fact_check", label: "Pilih Jenis" },
    { icon: "upload_file", label: "Upload" },
    { icon: "visibility", label: "Review" },
];

// Short month map
const shortMonth: Record<string, string> = {
    Januari: "Jan", Februari: "Feb", Maret: "Mar", April: "Apr",
    Mei: "Mei", Juni: "Jun", Juli: "Jul", Agustus: "Agu",
    September: "Sep", Oktober: "Okt", November: "Nov", Desember: "Des",
};

// Short tax-type label
const shortTaxLabel: Record<string, string> = {
    pph21: "PPh 21",
    pph23: "PPh 23",
    ppn: "PPN",
};

export default function PajakPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form state
    const [currentStep] = useState(1);
    const [selectedTax, setSelectedTax] = useState("pph21");
    const [selectedYear, setSelectedYear] = useState("2023");
    const [selectedMonth, setSelectedMonth] = useState("Desember");
    const [hasTransaction, setHasTransaction] = useState<boolean | null>(true);

    const progressPercent = Math.round((currentStep / steps.length) * 100);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* ===== Sidebar ===== */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:flex`}
            >
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/images/logo-color.png"
                            alt="ALI Logo"
                            width={160}
                            height={96}
                            className="h-24 w-auto"
                        />
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {sidebarNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${item.active
                                ? "text-[#2a6ba7] bg-[#2a6ba7]/5"
                                : "text-slate-500 hover:bg-slate-50"
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <div className="pt-8 pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Layanan Baru
                    </div>
                    <Link
                        href="/layanan"
                        className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-all"
                    >
                        <span className="material-symbols-outlined">add_box</span>
                        Tambah Layanan
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="size-10 rounded-full bg-[#2a6ba7] text-white flex items-center justify-center font-bold">
                            JD
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black">John Doe</span>
                            <span className="text-[10px] font-bold text-slate-400">Premium Member</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ===== Main Content ===== */}
            <main className="lg:ml-64 min-h-screen">
                {/* Top Nav */}
                <nav className="sticky top-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden size-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    <div className="flex-1 max-w-xl mx-8 hidden sm:block">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Cari dokumen atau layanan..."
                                className="w-full h-11 pl-12 pr-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2a6ba7]/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="size-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <Link href="/" className="text-sm font-black text-slate-500 hover:text-[#2a6ba7] transition-colors">
                            Keluar
                        </Link>
                    </div>
                </nav>

                {/* Page Content */}
                <div className="p-6 lg:p-10">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link href="/dashboard" className="hover:text-[#2a6ba7] transition-colors">
                            Dashboard
                        </Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-slate-900 font-medium">Buat Laporan Pajak</span>
                    </div>

                    {/* Progress Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 mb-8">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-[#2a6ba7] uppercase tracking-wider">
                                    Langkah {currentStep} dari {steps.length}
                                </span>
                                <span className="text-sm font-bold text-slate-900">
                                    {progressPercent}% Lengkap
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-[#2a6ba7] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-8 md:pl-10">
                            {steps.map((step, idx) => (
                                <div
                                    key={step.label}
                                    className={`flex items-center gap-2 ${idx < currentStep
                                        ? "text-[#2a6ba7]"
                                        : "text-slate-400"
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{step.icon}</span>
                                    <span className={`text-sm ${idx < currentStep ? "font-semibold" : "font-medium"}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Grid: Form + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column: Form */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {/* Identitas Laporan Pajak */}
                            <section className="bg-white p-8 rounded-2xl border border-slate-200">
                                <h2 className="text-2xl font-black text-slate-900 mb-6">
                                    Identitas Laporan Pajak
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Jenis Pajak */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Jenis Pajak
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedTax}
                                                onChange={(e) => setSelectedTax(e.target.value)}
                                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 pr-10 focus:ring-2 focus:ring-[#2a6ba7]/30 focus:border-[#2a6ba7] outline-none text-slate-900 transition-all text-lg"
                                            >
                                                {taxTypes.map((t) => (
                                                    <option key={t.value} value={t.value}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tahun Pajak */}
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Tahun Pajak
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 pr-10 focus:ring-2 focus:ring-[#2a6ba7]/30 focus:border-[#2a6ba7] outline-none text-slate-900 transition-all text-lg"
                                            >
                                                {taxYears.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                calendar_today
                                            </span>
                                        </div>
                                    </div>

                                    {/* Masa / Bulan */}
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Masa / Bulan
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 pr-10 focus:ring-2 focus:ring-[#2a6ba7]/30 focus:border-[#2a6ba7] outline-none text-slate-900 transition-all text-lg"
                                            >
                                                {months.map((m) => (
                                                    <option key={m} value={m}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                schedule
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Status Transaksi */}
                            <section className="bg-white p-8 rounded-2xl border border-slate-200">
                                <h2 className="text-xl font-black text-slate-900 mb-2">
                                    Status Transaksi
                                </h2>
                                <p className="text-slate-500 mb-6 text-sm">
                                    Apakah terdapat transaksi pajak pada periode yang dipilih?
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Option: Ada Transaksi */}
                                    <button
                                        type="button"
                                        onClick={() => setHasTransaction(true)}
                                        className={`relative text-left cursor-pointer border-2 p-6 rounded-2xl flex flex-col gap-4 transition-all hover:shadow-md ${hasTransaction === true
                                            ? "border-[#2a6ba7] bg-[#2a6ba7]/5"
                                            : "border-slate-100 bg-slate-50 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`p-3 rounded-xl text-white ${hasTransaction === true
                                                    ? "bg-[#2a6ba7]"
                                                    : "bg-slate-300"
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined">receipt_long</span>
                                            </div>
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${hasTransaction === true
                                                    ? "border-[#2a6ba7]"
                                                    : "border-slate-300"
                                                    }`}
                                            >
                                                {hasTransaction === true && (
                                                    <div className="w-3 h-3 rounded-full bg-[#2a6ba7]" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                Ya, Ada Transaksi
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Saya memiliki data transaksi untuk dilaporkan pada periode ini.
                                            </p>
                                        </div>
                                    </button>

                                    {/* Option: Nihil */}
                                    <button
                                        type="button"
                                        onClick={() => setHasTransaction(false)}
                                        className={`relative text-left cursor-pointer border-2 p-6 rounded-2xl flex flex-col gap-4 transition-all hover:shadow-md ${hasTransaction === false
                                            ? "border-[#2a6ba7] bg-[#2a6ba7]/5"
                                            : "border-slate-100 bg-slate-50 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`p-3 rounded-xl ${hasTransaction === false
                                                    ? "bg-[#2a6ba7] text-white"
                                                    : "bg-slate-200 text-slate-600"
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined">block</span>
                                            </div>
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${hasTransaction === false
                                                    ? "border-[#2a6ba7]"
                                                    : "border-slate-300"
                                                    }`}
                                            >
                                                {hasTransaction === false && (
                                                    <div className="w-3 h-3 rounded-full bg-[#2a6ba7]" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                Tidak (Nihil)
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Tidak ada transaksi pajak untuk dilaporkan (Laporan Nihil).
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Sidebar Summary */}
                        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                            {/* Ringkasan Laporan */}
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h2 className="text-lg font-black text-slate-900">
                                        Ringkasan Laporan
                                    </h2>
                                </div>
                                <div className="p-6 flex flex-col gap-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#2a6ba7]">info</span>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    Estimasi Selesai
                                                </p>
                                                <p className="text-sm font-black text-slate-900">
                                                    1-2 Hari Kerja
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Jenis Pajak</span>
                                                <span className="font-medium text-slate-900">
                                                    {shortTaxLabel[selectedTax] || "—"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Periode</span>
                                                <span className="font-medium text-slate-900">
                                                    {shortMonth[selectedMonth] || selectedMonth} {selectedYear}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Status</span>
                                                <span className="font-medium text-[#2a6ba7]">
                                                    {hasTransaction === null
                                                        ? "—"
                                                        : hasTransaction
                                                            ? "Normal"
                                                            : "Nihil"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button className="w-full bg-[#2a6ba7] hover:bg-[#235a8f] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#2a6ba7]/20 flex items-center justify-center gap-2 cursor-pointer">
                                            <span>Lanjut ke Upload</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                        <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                            <span className="material-symbols-outlined">save</span>
                                            <span>Simpan Draft</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-[#2a6ba7]/5 border-t border-[#2a6ba7]/10">
                                    <p className="text-xs text-center text-slate-500">
                                        Butuh bantuan?{" "}
                                        <Link
                                            href="https://wa.me/6285333338818"
                                            target="_blank"
                                            className="text-[#2a6ba7] font-bold hover:underline"
                                        >
                                            Hubungi Konsultan
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="bg-gradient-to-br from-[#2a6ba7] to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-white/80">lightbulb</span>
                                    <h3 className="font-black">Tips Pengisian</h3>
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed mb-4">
                                    Pastikan data masa pajak sesuai dengan dokumen pendukung yang akan diupload nanti untuk mempercepat proses verifikasi.
                                </p>
                                <Link
                                    href="#"
                                    className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors inline-block"
                                >
                                    Lihat Panduan Lengkap
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-3 z-50">
                <button className="flex-1 bg-[#2a6ba7] text-white font-bold py-3 rounded-xl cursor-pointer">
                    Lanjut
                </button>
                <button className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 cursor-pointer">
                    Draft
                </button>
            </div>
        </div>
    );
}
