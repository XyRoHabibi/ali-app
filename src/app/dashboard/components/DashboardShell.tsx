"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// Sidebar navigation items
const sidebarNavItems = [
    { href: "/dashboard", label: "Overview", icon: "dashboard" },
    { href: "/dashboard/permohonan", label: "Permohonan Saya", icon: "description" },
    { href: "/dashboard/dokumen", label: "Dokumen Legal", icon: "folder" },
    { href: "/dashboard/harga", label: "Billing & Harga", icon: "payments" },
    { href: "/dashboard/pajak", label: "Pelaporan Pajak", icon: "receipt_long" },
];

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const userInitials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "PG";

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:flex`}
            >
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/images/logo-color.png"
                            alt="ALI Logo"
                            width={160}
                            height={96}
                            className="h-24 w-auto object-contain"
                        />
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {sidebarNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                    ? "text-[#2a6ba7] bg-[#2a6ba7]/5"
                                    : "text-slate-500 hover:bg-slate-50"
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}

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

                <div className="p-4 border-t border-slate-200 mt-auto">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="size-10 rounded-full bg-[#2a6ba7] text-white flex items-center justify-center font-bold text-sm">
                            {userInitials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black">{session?.user?.name || "Pengguna"}</span>
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
            <main className="lg:ml-64 min-h-screen flex flex-col">
                {/* Top Nav */}
                <nav className="sticky top-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-40 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden size-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    <div className="flex-1 max-w-xl mx-8 hidden sm:block">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 select-none pointer-events-none">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Cari dokumen atau layanan..."
                                className="w-full h-11 pl-12 pr-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2a6ba7]/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="size-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 relative hover:bg-slate-100 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/masuk" })}
                            className="text-sm font-black text-slate-500 hover:text-[#2a6ba7] transition-colors cursor-pointer"
                        >
                            Keluar
                        </button>
                    </div>
                </nav>

                <div className="p-6 lg:p-10 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
