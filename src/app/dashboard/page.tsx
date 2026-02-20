"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Application {
    id: string;
    name: string;
    status: string;
    estimate: string | null;
    createdAt: string;
    service: { id: string; name: string };
    documents: { id: string }[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Menunggu", color: "bg-amber-500/10 text-amber-500" },
    PROCESS: { label: "Diproses", color: "bg-blue-500/10 text-blue-500" },
    COMPLETED: { label: "Selesai", color: "bg-emerald-500/10 text-emerald-500" },
    CANCELLED: { label: "Dibatalkan", color: "bg-red-500/10 text-red-500" },
};

const ICON_MAP: Record<string, { bg: string; color: string }> = {
    PENDING: { bg: "bg-amber-500/10", color: "text-amber-500" },
    PROCESS: { bg: "bg-[#2a6ba7]/10", color: "text-[#2a6ba7]" },
    COMPLETED: { bg: "bg-emerald-500/10", color: "text-emerald-500" },
    CANCELLED: { bg: "bg-red-500/10", color: "text-red-500" },
};

export default function DashboardPage() {
    const { data: session } = useSession();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

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

    // Calculate stats from real data
    const totalApps = applications.length;
    const activeApps = applications.filter(a => a.status === "PROCESS").length;
    const completedApps = applications.filter(a => a.status === "COMPLETED").length;
    const totalDocs = applications.reduce((sum, a) => sum + a.documents.length, 0);

    const statsData = [
        {
            label: "Total Permohonan",
            value: totalApps.toString(),
            icon: "description",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-500",
        },
        {
            label: "Sedang Aktif",
            value: activeApps.toString(),
            icon: "pending_actions",
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-500",
        },
        {
            label: "Selesai",
            value: completedApps.toString(),
            icon: "check_circle",
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-500",
        },
        {
            label: "Total Dokumen",
            value: totalDocs.toString(),
            icon: "folder",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-500",
        },
    ];

    // Recent applications (last 5)
    const recentApps = applications.slice(0, 5);

    // Completed apps with documents
    const readyDocs = applications.filter(a => a.status === "COMPLETED" && a.documents.length > 0).slice(0, 4);

    return (
        <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">
                        Selamat Datang, {session?.user?.name || "Pengguna"} 👋
                    </h1>
                    <p className="text-slate-500 font-bold">
                        Pantau proses legalitas bisnis Anda secara real-time.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/harga"
                        className="h-12 px-6 bg-[#2a6ba7] text-white rounded-xl flex items-center justify-center font-bold gap-2 hover:shadow-lg hover:shadow-[#2a6ba7]/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Order Layanan Baru
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statsData.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                            >
                                <span className={`material-symbols-outlined ${stat.textColor}`}>
                                    {stat.icon}
                                </span>
                            </div>
                        </div>
                        <p className="text-3xl font-black tracking-tight">
                            {loading ? (
                                <span className="inline-block h-8 w-12 bg-slate-100 rounded animate-pulse" />
                            ) : (
                                stat.value
                            )}
                        </p>
                        <p className="text-sm font-bold text-slate-400 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Applications */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black">Permohonan Terbaru</h2>
                        <Link
                            href="/dashboard/dokumen"
                            className="text-sm font-bold text-[#2a6ba7] hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        {loading ? (
                            <div className="p-8 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 animate-pulse">
                                        <div className="h-10 w-10 bg-slate-100 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-100 rounded w-48" />
                                            <div className="h-3 bg-slate-100 rounded w-32" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentApps.length === 0 ? (
                            <div className="p-12 text-center">
                                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">
                                    inbox
                                </span>
                                <p className="text-slate-500 font-bold mb-1">Belum ada permohonan</p>
                                <p className="text-sm text-slate-400">
                                    Mulai dengan memesan layanan legalitas.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-6 py-4">Layanan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Estimasi</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentApps.map((app) => {
                                        const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                                        const icon = ICON_MAP[app.status] || ICON_MAP.PENDING;
                                        return (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-xl ${icon.bg} flex items-center justify-center flex-shrink-0`}>
                                                            <span className={`material-symbols-outlined ${icon.color}`}>business</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm truncate">{app.name || app.service.name}</p>
                                                            <p className="text-xs text-slate-400 truncate">{app.service.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                                    {app.estimate || "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/dashboard/dokumen?appId=${app.id}`}
                                                        className="text-[#2a6ba7] hover:text-[#2a6ba7]/70 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Documents Ready Sidebar */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black">Dokumen Siap</h2>
                        <Link
                            href="/dashboard/dokumen"
                            className="text-sm font-bold text-[#2a6ba7] hover:underline"
                        >
                            Semua
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-slate-100 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-100 rounded w-32" />
                                            <div className="h-3 bg-slate-100 rounded w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : readyDocs.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">
                                    folder_open
                                </span>
                                <p className="text-sm text-slate-500 font-bold mb-1">Belum ada dokumen siap</p>
                                <p className="text-xs text-slate-400">
                                    Dokumen akan muncul setelah layanan selesai.
                                </p>
                            </div>
                        ) : (
                            readyDocs.map((app) => (
                                <Link
                                    key={app.id}
                                    href={`/dashboard/dokumen?appId=${app.id}`}
                                    className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-md transition-all group block"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-emerald-500">verified</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate group-hover:text-[#2a6ba7] transition-colors">
                                            {app.name || app.service.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {app.documents.length} dokumen siap
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#2a6ba7] transition-colors">
                                        chevron_right
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
