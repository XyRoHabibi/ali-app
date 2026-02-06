"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Sidebar navigation items
const sidebarNavItems = [
    { href: "/dashboard", label: "Overview", icon: "dashboard", active: true },
    { href: "/dashboard/permohonan", label: "Permohonan Saya", icon: "description", active: false },
    { href: "/dashboard/dokumen", label: "Dokumen Legal", icon: "folder", active: false },
    { href: "/harga", label: "Billing & Harga", icon: "payments", active: false },
];

// Stats data
const statsData = [
    {
        label: "Total Permohonan",
        value: "12",
        icon: "description",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-500",
    },
    {
        label: "Sedang Diproses",
        value: "3",
        icon: "pending_actions",
        bgColor: "bg-amber-500/10",
        textColor: "text-amber-500",
    },
    {
        label: "Selesai/Terbit",
        value: "9",
        icon: "verified",
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-500",
    },
    {
        label: "Total Dokumen",
        value: "24",
        icon: "folder_shared",
        bgColor: "bg-purple-500/10",
        textColor: "text-purple-500",
    },
];

// Recent orders data
const recentOrders = [
    {
        id: 1,
        name: "PT Maju Bersama",
        service: "Pendirian PT Perorangan",
        status: "Review Notaris",
        statusColor: "bg-amber-500/10 text-amber-500",
        estimate: "24 Jan 2024",
        icon: "business",
        iconBgColor: "bg-[#2a6ba7]/10",
        iconColor: "text-[#2a6ba7]",
        action: "view",
    },
    {
        id: 2,
        name: "Warung Kita",
        service: "Sertifikasi Halal",
        status: "Selesai",
        statusColor: "bg-emerald-500/10 text-emerald-500",
        estimate: "Terbit",
        icon: "verified",
        iconBgColor: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
        action: "download",
    },
];

// Ready documents
const readyDocuments = [
    {
        id: 1,
        name: "NIB_PT_Maju.pdf",
        type: "Digital Certificate",
        icon: "picture_as_pdf",
        iconBgColor: "bg-red-500/10",
        iconColor: "text-red-500",
    },
    {
        id: 2,
        name: "SK_Kemenkumham.pdf",
        type: "Legal Document",
        icon: "picture_as_pdf",
        iconBgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
    },
];

export default function DashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:flex`}
            >
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/images/logo-color.svg"
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

            {/* Main Content */}
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

                <div className="p-6 lg:p-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight">Selamat Datang, John! 👋</h1>
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
                                className="bg-white p-6 rounded-2xl border border-slate-200"
                            >
                                <div
                                    className={`size-12 rounded-xl ${stat.bgColor} ${stat.textColor} flex items-center justify-center mb-4`}
                                >
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
                                    {stat.label}
                                </p>
                                <h3 className="text-2xl font-black">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black">Permohonan Terbaru</h2>
                                <Link href="#" className="text-sm font-bold text-[#2a6ba7] hover:underline">
                                    Lihat Semua
                                </Link>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
                                        {recentOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`size-10 rounded-lg ${order.iconBgColor} ${order.iconColor} flex items-center justify-center`}
                                                        >
                                                            <span className="material-symbols-outlined">{order.icon}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold">{order.name}</span>
                                                            <span className="text-[10px] text-slate-400">{order.service}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 ${order.statusColor} text-[10px] font-black rounded-full uppercase`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                                    {order.estimate}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="text-[#2a6ba7] hover:text-[#2a6ba7]/70 transition-colors">
                                                        <span className="material-symbols-outlined">
                                                            {order.action === "view" ? "visibility" : "download"}
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Legal Documents Sidebar */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black">Dokumen Siap</h2>
                            <div className="space-y-4">
                                {readyDocuments.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 group cursor-pointer hover:border-[#2a6ba7]/30 transition-all"
                                    >
                                        <div
                                            className={`size-12 rounded-xl ${doc.iconBgColor} ${doc.iconColor} flex items-center justify-center`}
                                        >
                                            <span className="material-symbols-outlined">{doc.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black">{doc.name}</h4>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                {doc.type}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-[#2a6ba7] transition-colors">
                                            download
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Card */}
                            <div className="p-6 bg-gradient-to-br from-[#2a6ba7] to-blue-600 rounded-[2rem] text-white space-y-4">
                                <h4 className="text-lg font-black leading-tight">
                                    Butuh Konsultasi Legal Langsung?
                                </h4>
                                <p className="text-xs text-white/80 leading-relaxed font-bold">
                                    Tim legal kami siap membantu melalui video call atau chat intensif.
                                </p>
                                <Link
                                    href="https://wa.me/6285333338818"
                                    target="_blank"
                                    className="w-full h-11 bg-white text-[#2a6ba7] flex items-center justify-center rounded-xl text-xs font-black shadow-lg"
                                >
                                    Chat Tim Legal Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
