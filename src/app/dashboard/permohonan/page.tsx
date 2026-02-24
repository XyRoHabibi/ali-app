"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Application {
    id: string;
    name: string;
    status: string;
    estimate: string | null;
    createdAt: string;
    service: { id: string; name: string };
    documents: { id: string }[];
}

const STATUS_MAP: Record<string, { label: string; color: string; dotColor: string }> = {
    PENDING: {
        label: "Menunggu",
        color: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
        dotColor: "bg-amber-500",
    },
    PROCESS: {
        label: "Diproses",
        color: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
        dotColor: "bg-blue-500",
    },
    COMPLETED: {
        label: "Selesai",
        color: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
        dotColor: "bg-emerald-500",
    },
    CANCELLED: {
        label: "Dibatalkan",
        color: "bg-red-500/10 text-red-600 ring-red-500/20",
        dotColor: "bg-red-500",
    },
};

const ICON_MAP: Record<string, { bg: string; color: string; icon: string }> = {
    PENDING: { bg: "bg-amber-500/10", color: "text-amber-500", icon: "schedule" },
    PROCESS: { bg: "bg-[#2a6ba7]/10", color: "text-[#2a6ba7]", icon: "sync" },
    COMPLETED: { bg: "bg-emerald-500/10", color: "text-emerald-500", icon: "check_circle" },
    CANCELLED: { bg: "bg-red-500/10", color: "text-red-500", icon: "cancel" },
};

type FilterStatus = "ALL" | "PENDING" | "PROCESS" | "COMPLETED" | "CANCELLED";

export default function PermohonanPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

    useEffect(() => {
        async function fetchApplications() {
            try {
                const res = await fetch("/api/hono/applications");
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data.applications || []);
                }
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    // Filter and search
    const filteredApps = applications.filter((app) => {
        const matchesSearch =
            search === "" ||
            app.name.toLowerCase().includes(search.toLowerCase()) ||
            app.service.name.toLowerCase().includes(search.toLowerCase()) ||
            app.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalApps = applications.length;
    const pendingApps = applications.filter((a) => a.status === "PENDING").length;
    const processApps = applications.filter((a) => a.status === "PROCESS").length;
    const completedApps = applications.filter((a) => a.status === "COMPLETED").length;

    const filterTabs: { key: FilterStatus; label: string; count: number }[] = [
        { key: "ALL", label: "Semua", count: totalApps },
        { key: "PENDING", label: "Menunggu", count: pendingApps },
        { key: "PROCESS", label: "Diproses", count: processApps },
        { key: "COMPLETED", label: "Selesai", count: completedApps },
    ];

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <Link
                    href="/dashboard"
                    className="hover:text-[#2a6ba7] transition-colors"
                >
                    Dashboard
                </Link>
                <span className="material-symbols-outlined text-xs">
                    chevron_right
                </span>
                <span className="text-[#2a6ba7]">Permohonan Saya</span>
            </div>

            {/* Page Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">
                        Permohonan Saya
                    </h1>
                    <p className="text-slate-500 font-bold text-sm">
                        Pilih layanan di bawah untuk melihat detail status permohonan
                        Anda.
                    </p>
                </div>
                <Link
                    href="/layanan"
                    className="h-11 px-5 bg-[#2a6ba7] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2a6ba7]/20 transition-all flex items-center gap-2 w-fit"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Ajukan Layanan Baru
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        label: "Total",
                        value: totalApps,
                        icon: "description",
                        bg: "bg-slate-50",
                        iconBg: "bg-slate-100",
                        iconColor: "text-slate-500",
                    },
                    {
                        label: "Menunggu",
                        value: pendingApps,
                        icon: "schedule",
                        bg: "bg-amber-50/50",
                        iconBg: "bg-amber-500/10",
                        iconColor: "text-amber-500",
                    },
                    {
                        label: "Diproses",
                        value: processApps,
                        icon: "sync",
                        bg: "bg-blue-50/50",
                        iconBg: "bg-blue-500/10",
                        iconColor: "text-blue-500",
                    },
                    {
                        label: "Selesai",
                        value: completedApps,
                        icon: "check_circle",
                        bg: "bg-emerald-50/50",
                        iconBg: "bg-emerald-500/10",
                        iconColor: "text-emerald-500",
                    },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.bg} rounded-2xl border border-slate-200/80 p-5 transition-all hover:shadow-md`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className={`h-10 w-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}
                            >
                                <span
                                    className={`material-symbols-outlined text-lg ${stat.iconColor}`}
                                >
                                    {stat.icon}
                                </span>
                            </div>
                        </div>
                        <p className="text-2xl font-black tracking-tight">
                            {loading ? (
                                <span className="inline-block h-7 w-10 bg-slate-200/60 rounded-lg animate-pulse" />
                            ) : (
                                stat.value
                            )}
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs + Search */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 lg:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterStatus(tab.key)}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${filterStatus === tab.key
                                        ? "bg-white text-[#2a6ba7] shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab.label}
                                {!loading && (
                                    <span
                                        className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${filterStatus === tab.key
                                                ? "bg-[#2a6ba7]/10 text-[#2a6ba7]"
                                                : "bg-slate-200/60 text-slate-400"
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg select-none pointer-events-none">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Cari layanan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full sm:w-64 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7]/30 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Table Content */}
                {loading ? (
                    <div className="p-8 space-y-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 animate-pulse"
                            >
                                <div className="h-12 w-12 bg-slate-100 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 rounded w-56" />
                                    <div className="h-3 bg-slate-100 rounded w-36" />
                                </div>
                                <div className="h-6 w-20 bg-slate-100 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="size-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                            <span className="material-symbols-outlined text-4xl text-slate-300">
                                {search || filterStatus !== "ALL"
                                    ? "search_off"
                                    : "inbox"}
                            </span>
                        </div>
                        <p className="text-slate-600 font-bold mb-1">
                            {search || filterStatus !== "ALL"
                                ? "Tidak ada hasil ditemukan"
                                : "Belum ada permohonan"}
                        </p>
                        <p className="text-sm text-slate-400 mb-6">
                            {search || filterStatus !== "ALL"
                                ? "Coba ubah filter atau kata kunci pencarian Anda."
                                : "Mulai dengan mengajukan layanan legalitas baru."}
                        </p>
                        {!search && filterStatus === "ALL" && (
                            <Link
                                href="/layanan"
                                className="inline-flex items-center gap-2 h-11 px-6 bg-[#2a6ba7] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2a6ba7]/20 transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    add
                                </span>
                                Ajukan Layanan Baru
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Mobile Card Layout */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {filteredApps.map((app) => {
                                const status =
                                    STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                                const iconData =
                                    ICON_MAP[app.status] || ICON_MAP.PENDING;
                                return (
                                    <Link
                                        key={app.id}
                                        href={`/dashboard/permohonan/detail-permohonan?appId=${app.id}`}
                                        className="block p-5 hover:bg-slate-50/80 transition-all active:bg-slate-100/60 group"
                                    >
                                        <div className="flex items-start gap-3.5 mb-3">
                                            <div
                                                className={`h-11 w-11 rounded-xl ${iconData.bg} flex items-center justify-center flex-shrink-0`}
                                            >
                                                <span
                                                    className={`material-symbols-outlined ${iconData.color}`}
                                                >
                                                    {iconData.icon}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate group-hover:text-[#2a6ba7] transition-colors">
                                                    {app.name ||
                                                        app.service.name}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                                    {app.service.name}
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-[#2a6ba7] transition-colors text-lg mt-0.5">
                                                chevron_right
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between ml-[54px]">
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black rounded-full ring-1 ${status.color}`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${status.dotColor}`}
                                                    />
                                                    {status.label}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    {formatDate(app.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Table Layout */}
                        <table className="w-full text-left hidden md:table">
                            <thead className="bg-slate-50/80 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Layanan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Tanggal Pengajuan</th>
                                    <th className="px-6 py-4">Estimasi</th>
                                    <th className="px-6 py-4">Dokumen</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredApps.map((app) => {
                                    const status =
                                        STATUS_MAP[app.status] ||
                                        STATUS_MAP.PENDING;
                                    const iconData =
                                        ICON_MAP[app.status] || ICON_MAP.PENDING;
                                    return (
                                        <tr
                                            key={app.id}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3.5">
                                                    <div
                                                        className={`h-11 w-11 rounded-xl ${iconData.bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
                                                    >
                                                        <span
                                                            className={`material-symbols-outlined ${iconData.color}`}
                                                        >
                                                            {iconData.icon}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate group-hover:text-[#2a6ba7] transition-colors">
                                                            {app.name ||
                                                                app.service
                                                                    .name}
                                                        </p>
                                                        <p className="text-xs text-slate-400 truncate mt-0.5">
                                                            {app.service.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-full ring-1 ${status.color}`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${status.dotColor} ${app.status ===
                                                                "PROCESS"
                                                                ? "animate-pulse"
                                                                : ""
                                                            }`}
                                                    />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm text-slate-600 font-medium">
                                                    {formatDate(app.createdAt)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm text-slate-500 font-medium">
                                                    {app.estimate || (
                                                        <span className="text-slate-300">
                                                            —
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">
                                                        attach_file
                                                    </span>
                                                    <span className="text-sm text-slate-500 font-bold">
                                                        {app.documents.length}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/dashboard/permohonan/detail-permohonan?appId=${app.id}`}
                                                    className="inline-flex items-center gap-2 h-9 px-4 bg-[#2a6ba7]/5 text-[#2a6ba7] text-xs font-black rounded-xl hover:bg-[#2a6ba7] hover:text-white transition-all"
                                                >
                                                    Lihat Detail
                                                    <span className="material-symbols-outlined text-sm">
                                                        arrow_forward
                                                    </span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Table Footer */}
                {!loading && filteredApps.length > 0 && (
                    <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs font-bold text-slate-400">
                            Menampilkan{" "}
                            <span className="text-slate-600">
                                {filteredApps.length}
                            </span>{" "}
                            dari{" "}
                            <span className="text-slate-600">{totalApps}</span>{" "}
                            permohonan
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">
                                info
                            </span>
                            Klik layanan untuk melihat detail
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
