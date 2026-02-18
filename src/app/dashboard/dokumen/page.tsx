"use client";

import { useState } from "react";
import Link from "next/link";

// Filter categories
const filterCategories = [
    { label: "Semua", active: true },
    { label: "Legalitas", active: false },
    { label: "Perpajakan", active: false },
    { label: "Kontrak", active: false },
];

// Document cards data
const documents = [
    {
        id: 1,
        title: "NIB Perusahaan",
        subtitle: "ID: 812031920391",
        subtitleMono: true,
        date: "12 Jan 2024",
        status: "Valid",
        statusType: "valid" as const,
        icon: "verified_user",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        actions: ["view", "download"],
    },
    {
        id: 2,
        title: "NPWP Perusahaan",
        subtitle: "ID: 01.234.567.8-901",
        subtitleMono: true,
        date: "10 Jan 2024",
        status: "Valid",
        statusType: "valid" as const,
        icon: "account_balance_wallet",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
        actions: ["view", "download"],
    },
    {
        id: 3,
        title: "Akta Pendirian",
        subtitle: "No. 24 - Notaris H. Asep",
        subtitleMono: false,
        date: "05 Jan 2020",
        status: "Valid",
        statusType: "valid" as const,
        icon: "gavel",
        iconBg: "bg-purple-50",
        iconColor: "text-purple-500",
        actions: ["view", "download"],
    },
    {
        id: 4,
        title: "Domisili Perusahaan",
        subtitle: "Kelurahan Setiabudi",
        subtitleMono: false,
        date: null,
        expiry: "Exp: 20 Feb 2024",
        status: "Expiring",
        statusType: "expiring" as const,
        icon: "business",
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
        borderClass: "border-red-200",
        actions: ["edit", "download"],
    },
];

// Directors & Commissioners data
const boardMembers = [
    {
        id: 1,
        name: "John Doe",
        role: "Direktur Utama",
        initials: "JD",
        initialsBg: "bg-blue-100",
        initialsColor: "text-blue-600",
        tenureLabel: "3 Tahun 4 Bulan Tersisa",
        tenureLabelColor: "text-blue-600",
        tenurePercent: 45,
        tenureBarColor: "bg-blue-600",
        validUntil: "Berlaku hingga: Mei 2026",
        documents: [
            { label: "Akta", completed: true },
            { label: "SK", completed: true },
            { label: "NPWP", completed: true },
        ],
    },
    {
        id: 2,
        name: "Sarah Smith",
        role: "Komisaris",
        initials: "SS",
        initialsBg: "bg-purple-100",
        initialsColor: "text-purple-600",
        tenureLabel: "2 Tahun 1 Bulan Tersisa",
        tenureLabelColor: "text-purple-600",
        tenurePercent: 65,
        tenureBarColor: "bg-purple-600",
        validUntil: "Berlaku hingga: Maret 2025",
        documents: [
            { label: "Akta", completed: true },
            { label: "SK", completed: true },
            { label: "NPWP", completed: false },
        ],
    },
];

// Agreements data
const agreements = [
    {
        id: 1,
        name: "Kerja sama pemasok",
        status: "Aktif",
        statusType: "active" as const,
        validUntil: "Juli 2024",
        expired: false,
    },
    {
        id: 2,
        name: "Jasa Konsultan",
        status: "Expired",
        statusType: "expired" as const,
        validUntil: "Jun 2023",
        expired: true,
    },
    {
        id: 3,
        name: "Perjanjian Kerjasama",
        status: "Aktif",
        statusType: "active" as const,
        validUntil: "Des 2025",
        expired: false,
    },
];

// Timeline items
const timelineItems = [
    {
        id: 1,
        statusLabel: "SELESAI",
        statusColor: "text-emerald-600",
        borderColor: "border-emerald-500",
        title: "Laporan Pajak Masa",
        description: "Sudah dilaporkan oleh tim finance.",
        date: "10 Mei 2024",
        dateBg: "bg-slate-100",
        dateColor: "text-slate-600",
        pulsing: false,
    },
    {
        id: 2,
        statusLabel: "BELUM LAPOR",
        statusColor: "text-orange-600",
        borderColor: "border-orange-500",
        title: "Perpanjangan Izin Usaha",
        description: "Segera proses sebelum tenggat waktu.",
        date: "20 Mei 2024",
        dateBg: "bg-orange-50 border border-orange-100",
        dateColor: "text-orange-600",
        pulsing: true,
    },
];

function StatusBadge({ status, type }: { status: string; type: "valid" | "expiring" }) {
    if (type === "valid") {
        return (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                {status}
            </span>
        );
    }
    return (
        <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
            {status}
        </span>
    );
}

function AgreementStatusBadge({ status, type }: { status: string; type: "active" | "expired" }) {
    if (type === "active") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {status}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {status}
        </span>
    );
}

export default function DokumenPage() {
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <>
            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center text-slate-500 text-sm gap-2 mb-6">
                <Link href="/dashboard" className="hover:text-[#2a6ba7] transition-colors">
                    Dashboard
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-[#2a6ba7] font-bold">Brankas Dokumen</span>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Brankas Dokumen</h1>
                        <p className="text-slate-500 max-w-2xl">
                            Akses dan kelola semua dokumen legalitas perusahaan Anda di satu tempat yang aman dan terenkripsi.
                        </p>
                    </div>
                    <button className="bg-[#2a6ba7] hover:bg-[#1e5a8a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30">
                        <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        Unggah Dokumen
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="bg-white rounded-lg border border-slate-200 flex items-center p-1 shadow-sm">
                        <span className="material-symbols-outlined text-slate-400 pl-3">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-none bg-transparent focus:ring-0 text-sm w-64 text-slate-900 placeholder-slate-400 outline-none px-2 py-1.5"
                            placeholder="Cari dokumen (NIB, NPWP...)"
                        />
                    </div>
                    {filterCategories.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => setActiveFilter(cat.label)}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === cat.label
                                    ? "bg-[#2a6ba7] text-white"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                    <button className="bg-white text-slate-600 p-2 rounded-lg border border-slate-200 transition-colors hover:bg-slate-50 ml-auto">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>

                {/* ===== MAIN CONTENT ===== */}
                <div className="space-y-8">
                    {/* Document Grid (4 cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${doc.borderClass ? doc.borderClass : "border-slate-200"
                                    }`}
                            >
                                {/* Decorative circle for expiring */}
                                {doc.statusType === "expiring" && (
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                                )}

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className={`${doc.iconBg} p-2.5 rounded-lg ${doc.iconColor}`}>
                                        <span className="material-symbols-outlined">{doc.icon}</span>
                                    </div>
                                    <StatusBadge status={doc.status} type={doc.statusType} />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{doc.title}</h3>
                                <p className={`text-xs text-slate-400 mb-3 ${doc.subtitleMono ? "font-mono" : ""}`}>
                                    {doc.subtitle}
                                </p>
                                {doc.date && (
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        <span>{doc.date}</span>
                                    </div>
                                )}
                                {doc.expiry && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm mb-6 font-medium">
                                        <span className="material-symbols-outlined text-sm">warning</span>
                                        <span>{doc.expiry}</span>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {doc.actions.includes("view") && (
                                        <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                            <span className="material-symbols-outlined text-sm">visibility</span> Lihat
                                        </button>
                                    )}
                                    {doc.actions.includes("edit") && (
                                        <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                            <span className="material-symbols-outlined text-sm text-slate-400">edit</span> Perbarui
                                        </button>
                                    )}
                                    {doc.actions.includes("download") && (
                                        <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                            <span className="material-symbols-outlined text-sm">download</span> Unduh
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Masa Jabatan Direktur & Komisaris */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Masa Jabatan Direktur &amp; Komisaris</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {boardMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-10 w-10 ${member.initialsBg} rounded-full flex items-center justify-center ${member.initialsColor} font-bold`}
                                            >
                                                {member.initials}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base">{member.name}</h3>
                                                <p className="text-xs text-slate-500">{member.role}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">Aktif</span>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-500">Masa Jabatan</span>
                                            <span className={`font-medium ${member.tenureLabelColor}`}>
                                                {member.tenureLabel}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                                            <div
                                                className={`${member.tenureBarColor} h-2.5 rounded-full`}
                                                style={{ width: `${member.tenurePercent}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 text-xs text-right text-slate-400">{member.validUntil}</div>
                                    </div>
                                    <div className="flex gap-2 mt-auto">
                                        {member.documents.map((docItem) => (
                                            <div
                                                key={docItem.label}
                                                className="flex-1 bg-slate-50 rounded px-3 py-2 flex items-center gap-2 border border-slate-100"
                                            >
                                                <span
                                                    className={`material-symbols-outlined text-sm ${docItem.completed ? "text-emerald-500" : "text-slate-300"
                                                        }`}
                                                >
                                                    {docItem.completed ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                                <span
                                                    className={`text-xs font-medium ${docItem.completed ? "" : "text-slate-400"
                                                        }`}
                                                >
                                                    {docItem.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Grid: Agreements + Timeline (left) | Data Penting + CTA (right) */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Left Column (2/3) */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Daftar Perjanjian */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="font-bold text-lg">Daftar Perjanjian</h2>
                                    <button className="text-[#2a6ba7] text-sm font-medium hover:underline">
                                        Lihat Semua
                                    </button>
                                </div>
                                <div className="p-0">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">Nama Perjanjian</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Berlaku Hingga</th>
                                                <th className="px-6 py-3 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {agreements.map((agreement) => (
                                                <tr key={agreement.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{agreement.name}</td>
                                                    <td className="px-6 py-4">
                                                        <AgreementStatusBadge
                                                            status={agreement.status}
                                                            type={agreement.statusType}
                                                        />
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 ${agreement.expired
                                                                ? "text-red-500 font-medium"
                                                                : "text-slate-500"
                                                            }`}
                                                    >
                                                        {agreement.validUntil}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-[#2a6ba7]">
                                                            <span className="material-symbols-outlined text-lg">
                                                                more_vert
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Perizinan & Pajak Bulanan */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-bold text-lg">Perizinan &amp; Pajak Bulanan</h2>
                                    <span className="text-xs text-slate-400">Mei 2024</span>
                                </div>
                                <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                                    {timelineItems.map((item) => (
                                        <div key={item.id} className="relative">
                                            <div
                                                className={`absolute -left-[21px] top-1 bg-white border-2 ${item.borderColor} w-3 h-3 rounded-full ${item.pulsing ? "animate-pulse" : ""
                                                    }`}
                                            ></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                <div>
                                                    <div className={`text-xs ${item.statusColor} font-bold mb-1`}>
                                                        {item.statusLabel}
                                                    </div>
                                                    <h4 className="font-medium">{item.title}</h4>
                                                    <p className="text-xs text-slate-500">{item.description}</p>
                                                </div>
                                                <div
                                                    className={`mt-2 sm:mt-0 ${item.dateBg} px-3 py-1 rounded text-sm font-mono ${item.dateColor}`}
                                                >
                                                    {item.date}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (1/3) */}
                        <div className="xl:col-span-1 space-y-6">
                            {/* Data Penting */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">lock</span>
                                    Data Penting
                                </h2>
                                <div className="grid gap-4">
                                    {/* Email Perusahaan */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="bg-white p-2 rounded-md shadow-sm">
                                                <span className="material-symbols-outlined text-[#2a6ba7] text-sm">
                                                    email
                                                </span>
                                            </div>
                                            <button className="text-slate-400 hover:text-[#2a6ba7]">
                                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">Email Perusahaan</p>
                                        <p className="font-mono text-sm truncate">admin@perusahaan.com</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-xs text-slate-400">Password Email</p>
                                            <span className="font-mono text-xs tracking-widest text-slate-600">
                                                ••••••••
                                            </span>
                                        </div>
                                    </div>

                                    {/* Akun OSS */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="bg-white p-2 rounded-md shadow-sm">
                                                <span className="material-symbols-outlined text-purple-500 text-sm">
                                                    vpn_key
                                                </span>
                                            </div>
                                            <button className="text-slate-400 hover:text-[#2a6ba7]">
                                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">Akun OSS / Perizinan</p>
                                        <p className="font-mono text-sm">izin123</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-xs text-slate-400">Password</p>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs tracking-widest text-slate-600">
                                                    ••••••••
                                                </span>
                                                <span className="material-symbols-outlined text-xs text-slate-400 cursor-pointer">
                                                    visibility_off
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA - Butuh Bantuan Hukum? */}
                            <div className="bg-gradient-to-br from-[#2a6ba7] to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                                <h3 className="font-bold text-lg mb-2 relative z-10">Butuh Bantuan Hukum?</h3>
                                <p className="text-blue-100 text-sm mb-6 relative z-10">
                                    Tim legal kami siap membantu Anda 24/7 terkait dokumen ini.
                                </p>
                                <button className="w-full bg-white text-[#2a6ba7] font-bold py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2 relative z-10">
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                    Chat dengan Tim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-4 border-t border-slate-200 pt-6 pb-8">
                    <p className="text-center text-xs text-slate-400">
                        © 2024 PT Akses Legal Indonesia. Hak cipta dilindungi undang-undang. <br />
                        <a className="hover:text-[#2a6ba7] transition-colors" href="#">
                            Syarat Ketentuan
                        </a>{" "}
                        •{" "}
                        <a className="hover:text-[#2a6ba7] transition-colors" href="#">
                            Kebijakan Privasi
                        </a>
                    </p>
                </footer>
            </div>
        </>
    );
}
