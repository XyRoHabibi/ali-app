"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const adminNavItems = [
    { href: "/super-admin", label: "Dashboard", icon: "space_dashboard" },
    { href: "/super-admin/users", label: "Kelola User", icon: "group" },
    { href: "/super-admin/reminders", label: "Pengingat", icon: "notifications_active" },
];

interface AdminShellProps {
    children: React.ReactNode;
    user: {
        name?: string | null;
        email?: string | null;
    };
}

export default function AdminShell({ children, user }: AdminShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "SA";

    return (
        <div className="min-h-screen bg-[#0f172a]">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:flex`}
            >
                <div className="p-6 border-b border-[#334155]">
                    <Link href="/super-admin" className="flex items-center gap-3 group">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="material-symbols-outlined text-white text-xl">
                                shield_person
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-sm tracking-wide">
                                Super Admin
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                                Akses Legal
                            </span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <div className="px-4 pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Menu
                    </div>
                    {adminNavItems.map((item) => {
                        const isActive =
                            item.href === "/super-admin"
                                ? pathname === "/super-admin"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${isActive
                                    ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined text-xl ${isActive ? "text-indigo-400" : ""
                                        }`}
                                >
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}

                    <div className="pt-8 px-4 pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Navigasi
                    </div>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all duration-200"
                    >
                        <span className="material-symbols-outlined text-xl">
                            dashboard
                        </span>
                        User Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all duration-200"
                    >
                        <span className="material-symbols-outlined text-xl">
                            home
                        </span>
                        Website
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#334155] mt-auto">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/20">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-white">
                                {user.name || "Admin"}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-400">
                                Super Admin
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen flex flex-col">
                {/* Top Nav */}
                <nav className="sticky top-0 h-16 bg-[#1e293b]/80 backdrop-blur-md border-b border-[#334155] flex items-center justify-between px-6 lg:px-8 z-40 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden size-10 rounded-xl bg-[#334155] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#475569] transition-colors"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <span className="text-xs font-bold text-indigo-400">
                                ADMIN PANEL
                            </span>
                        </div>
                        <div className="h-8 w-px bg-[#334155]" />
                        <button
                            onClick={() => signOut({ callbackUrl: "/masuk" })}
                            className="text-sm font-black text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                            Keluar
                        </button>
                    </div>
                </nav>

                <div className="p-6 lg:p-8 flex-1">{children}</div>
            </main>
        </div>
    );
}
