"use client";

import { useState } from "react";
import Image from "next/image";
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
        date: "12 Jan 2024",
        status: "Valid",
        statusType: "valid" as const,
        icon: "verified_user",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
        actions: ["view", "download"],
    },
    {
        id: 2,
        title: "NPWP Perusahaan",
        subtitle: "ID: 01.234.567.8-901.000",
        date: "10 Jan 2024",
        status: "Valid",
        statusType: "valid" as const,
        icon: "account_balance_wallet",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-500",
        actions: ["view", "download"],
    },
    {
        id: 3,
        title: "Akta Pendirian",
        subtitle: "No. 24 - Notaris H. Asep",
        date: "05 Jan 2020",
        status: "Valid",
        statusType: "valid" as const,
        icon: "gavel",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-500",
        actions: ["view", "download"],
    },
    {
        id: 4,
        title: "SK Kemenkumham",
        subtitle: "AHU-00123.AH.01.01",
        date: "08 Jan 2020",
        status: "Valid",
        statusType: "valid" as const,
        icon: "policy",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        actions: ["view", "download"],
    },
    {
        id: 5,
        title: "Domisili Perusahaan",
        subtitle: "Kelurahan Setiabudi",
        date: null,
        expiry: "Exp: 20 Feb 2024",
        status: "Expiring",
        statusType: "expiring" as const,
        icon: "description",
        iconBg: "bg-rose-500/10",
        iconColor: "text-rose-500",
        actions: ["edit", "download"],
    },
];

// Tracking steps
const trackingSteps = [
    {
        label: "Sedang Dikirim",
        description: "Paket sedang dalam perjalanan menuju alamat tujuan.",
        time: "Hari ini, 14:30 WIB",
        active: true,
        completed: false,
    },
    {
        label: "Dijemput Kurir",
        description: null,
        time: "Kemarin, 16:00 WIB",
        active: false,
        completed: true,
    },
    {
        label: "Dokumen Siap",
        description: null,
        time: "Kemarin, 09:00 WIB",
        active: false,
        completed: true,
    },
];

function StatusBadge({ status, type }: { status: string; type: "valid" | "expiring" }) {
    if (type === "valid") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
                <span className="size-1.5 rounded-full bg-emerald-600"></span>
                {status}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-semibold text-yellow-600 ring-1 ring-inset ring-yellow-600/20">
            <span className="size-1.5 rounded-full bg-yellow-600"></span>
            {status}
        </span>
    );
}

export default function DokumenPage() {
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <>
            {/* Top Nav (optional breadcrumb only for this page? no, handled by layout, but this has specific breadcrumb style) */}
            {/* The layout has a standard top nav. This page added a custom breadcrumb inside nav or below it? */}
            {/* Original had custom breadcrumb in nav. But with new layout, nav is fixed. */}
            {/* I should check if I should add breadcrumb here. The Shell doesn't have page-specific breadcrumbs in the TopNav. */}
            {/* The Shell has 'search' and 'notifications'. */}
            {/* DokumenPage had a breadcrumb in the nav: "Dashboard > Brankas Dokumen". */}
            {/* I'll add it to the top of the content area instead, like PajakPage does. */}

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
                        <h1 className="text-3xl font-black tracking-tight">Brankas Dokumen</h1>
                        <p className="text-slate-500 max-w-2xl font-bold">
                            Akses dan kelola semua dokumen legalitas perusahaan Anda di satu tempat yang aman dan terenkripsi.
                        </p>
                    </div>
                    <button className="bg-[#2a6ba7] hover:bg-[#2a6ba7]/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-[#2a6ba7]/30 hover:shadow-lg hover:shadow-[#2a6ba7]/20">
                        <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        Unggah Dokumen
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 sticky top-20 z-10 backdrop-blur-xl bg-opacity-90">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#2a6ba7]/30 sm:text-sm"
                            placeholder="Cari dokumen (NIB, NPWP, Akta)..."
                        />
                    </div>
                    <div className="flex overflow-x-auto pb-1 md:pb-0 gap-2 no-scrollbar px-1">
                        {filterCategories.map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => setActiveFilter(cat.label)}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeFilter === cat.label
                                    ? "bg-[#2a6ba7] text-white"
                                    : "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                        <button className="whitespace-nowrap px-3 py-2 rounded-lg bg-transparent hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Document Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className={`group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 relative flex flex-col h-full ${doc.statusType === "expiring"
                                ? "hover:border-yellow-500/30"
                                : "hover:border-[#2a6ba7]/30"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${doc.iconBg} p-3 rounded-lg ${doc.iconColor}`}>
                                    <span className="material-symbols-outlined text-[28px]">{doc.icon}</span>
                                </div>
                                <StatusBadge status={doc.status} type={doc.statusType} />
                            </div>
                            <div className="mb-6 flex-1">
                                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-[#2a6ba7] transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono mb-2">{doc.subtitle}</p>
                                {doc.date && (
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                        {doc.date}
                                    </p>
                                )}
                                {doc.expiry && (
                                    <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">warning</span>
                                        {doc.expiry}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                                {doc.actions.includes("view") && (
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">visibility</span> Lihat
                                    </button>
                                )}
                                {doc.actions.includes("edit") && (
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">edit</span> Perbarui
                                    </button>
                                )}
                                {doc.actions.includes("download") && (
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#2a6ba7] border border-[#2a6ba7]/20 hover:bg-[#2a6ba7]/5 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">download</span> Unduh
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-200"></div>

            </div>
        </>
    );
}
