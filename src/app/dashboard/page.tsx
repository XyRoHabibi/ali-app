"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import HaloAIChat from "@/components/chat/HaloAIChat";

interface Application {
    id: string;
    name: string;
    status: string;
    estimate: string | null;
    createdAt: string;
    service: { id: string; name: string };
    documents: { id: string }[];
}

interface Reminder {
    id: string;
    title: string;
    type: string;
    dueDate: string;
    icon: string;
    remaining: number;
    status: string;
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
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [remindersLoading, setRemindersLoading] = useState(true);
    const [showAllReminders, setShowAllReminders] = useState(false);

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

    // Fetch reminders
    useEffect(() => {
        async function fetchReminders() {
            try {
                const res = await fetch("/api/hono/reminders");
                if (res.ok) {
                    const data = await res.json();
                    setReminders(data.reminders || []);
                }
            } catch (err) {
                console.error("Failed to fetch reminders:", err);
            } finally {
                setRemindersLoading(false);
            }
        }
        fetchReminders();
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

    // (removed readyDocs — replaced with chatbot)

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
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Dashboard Segment: Pengingat Pajak */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <div className="relative flex items-center justify-center">
                                    <span className="material-symbols-outlined text-red-500">
                                        notifications_active
                                    </span>
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                </div>
                                Pengingat
                            </h2>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 transition-all">
                            {remindersLoading ? (
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 animate-pulse">
                                            <div className="h-11 w-11 bg-slate-100 rounded-2xl" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-100 rounded w-48" />
                                                <div className="h-3 bg-slate-100 rounded w-32" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : reminders.length === 0 ? (
                                <div className="p-10 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">notifications_off</span>
                                    <p className="text-slate-500 font-bold mb-1">Belum ada pengingat</p>
                                    <p className="text-sm text-slate-400">Admin akan menambahkan pengingat untuk Anda.</p>
                                </div>
                            ) : (
                                <>
                                    {reminders.slice(0, showAllReminders ? reminders.length : 3).map((reminder) => (
                                        <div key={reminder.id} className="px-5 py-4 hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${reminder.status === "red"
                                                        ? "bg-red-50 text-red-600 border border-red-100"
                                                        : reminder.status === "amber"
                                                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                                                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-[22px]">
                                                        {reminder.icon}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <p className="font-extrabold text-sm text-slate-800 truncate group-hover:text-[#2a6ba7] transition-colors">
                                                            {reminder.title}
                                                        </p>
                                                        <span
                                                            className={`px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-md shadow-sm border flex-shrink-0 ${reminder.status === "red"
                                                                ? "bg-red-50 text-red-600 border-red-100/50"
                                                                : reminder.status === "amber"
                                                                    ? "bg-amber-50 text-amber-600 border-amber-100/50"
                                                                    : "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                                                                }`}
                                                        >
                                                            {reminder.remaining} HARI LAGI
                                                        </span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 truncate">
                                                            <span className="material-symbols-outlined text-[14px] text-slate-400">
                                                                calendar_clock
                                                            </span>
                                                            Batas: {new Date(reminder.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                                        </p>
                                                    </div>
                                                    {(reminder.remaining <= 3 && reminder.type === "pajak") && (
                                                        <div className="mt-3">
                                                            <Link
                                                                href="/dashboard/pajak"
                                                                className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                                                            >
                                                                <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.25),transparent)] -translate-x-full group-hover/btn:translate-x-full duration-[800ms] ease-in-out"></div>
                                                                <span className="material-symbols-outlined text-[16px] animate-pulse relative z-10">edit_document</span>
                                                                <span className="relative z-10">Lapor Pajak Sekarang</span>
                                                                <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10">arrow_forward</span>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {reminders.length > 3 && (
                                        <button
                                            onClick={() => setShowAllReminders(!showAllReminders)}
                                            className="w-full py-3 text-sm font-bold text-[#2a6ba7] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            {showAllReminders ? (
                                                <>
                                                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                                    Tutup
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                                    Lihat {reminders.length - 3} Lainnya
                                                </>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="space-y-6">
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
                                <>
                                    {/* Mobile Card Layout */}
                                    <div className="md:hidden divide-y divide-slate-100">
                                        {recentApps.map((app) => {
                                            const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                                            const icon = ICON_MAP[app.status] || ICON_MAP.PENDING;
                                            return (
                                                <div key={app.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className={`h-10 w-10 rounded-xl ${icon.bg} flex items-center justify-center flex-shrink-0`}>
                                                            <span className={`material-symbols-outlined ${icon.color}`}>business</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm truncate">{app.name || app.service.name}</p>
                                                            <p className="text-xs text-slate-400 truncate">{app.service.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between ml-[52px]">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>
                                                                {status.label}
                                                            </span>
                                                            {app.estimate && (
                                                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                                    {app.estimate}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/dashboard/dokumen?appId=${app.id}`}
                                                            className="h-8 w-8 rounded-lg bg-[#2a6ba7]/10 flex items-center justify-center text-[#2a6ba7] hover:bg-[#2a6ba7] hover:text-white transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Desktop Table Layout */}
                                    <table className="w-full text-left hidden md:table">
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
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Chatbot Sidebar — HaloAI Live Chat */}
                <div className="space-y-6">
                    <HaloAIChat />
                </div>
            </div>
        </>
    );
}
