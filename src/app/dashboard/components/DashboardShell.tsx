"use client";

import { useState, useEffect, useRef } from "react";
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

    // Company logo state
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [logoLoading, setLogoLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showLogoMenu, setShowLogoMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const userInitials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "PG";

    // Fetch company logo on mount
    useEffect(() => {
        async function fetchLogo() {
            try {
                const res = await fetch("/api/hono/company-logo");
                if (res.ok) {
                    const data = await res.json();
                    setCompanyLogo(data.companyLogo);
                }
            } catch (err) {
                console.error("Failed to fetch company logo:", err);
            } finally {
                setLogoLoading(false);
            }
        }
        fetchLogo();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowLogoMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle logo upload
    async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran logo maksimal 2MB.");
            return;
        }

        setUploading(true);
        setShowLogoMenu(false);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/hono/company-logo", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setCompanyLogo(data.companyLogo);
            } else {
                const data = await res.json();
                alert(data.error || "Gagal mengunggah logo.");
            }
        } catch (err) {
            console.error("Upload logo error:", err);
            alert("Terjadi kesalahan saat mengunggah logo.");
        } finally {
            setUploading(false);
            // Reset the file input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    // Handle logo delete
    async function handleLogoDelete() {
        setShowLogoMenu(false);
        if (!confirm("Hapus logo perusahaan?")) return;

        try {
            const res = await fetch("/api/hono/company-logo", {
                method: "DELETE",
            });

            if (res.ok) {
                setCompanyLogo(null);
            } else {
                const data = await res.json();
                alert(data.error || "Gagal menghapus logo.");
            }
        } catch (err) {
            console.error("Delete logo error:", err);
            alert("Terjadi kesalahan saat menghapus logo.");
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:flex`}
            >
                <div className="p-6">
                    {/* Logo Area with Upload */}
                    <div className="relative group" ref={menuRef}>
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleLogoUpload}
                            id="logo-upload-input"
                        />

                        {/* Logo Display */}
                        <div
                            className="relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-[#2a6ba7]/20"
                            onClick={() => setShowLogoMenu(!showLogoMenu)}
                        >
                            {logoLoading ? (
                                <div className="h-24 w-full flex items-center justify-center">
                                    <div className="h-8 w-8 border-2 border-slate-200 border-t-[#2a6ba7] rounded-full animate-spin" />
                                </div>
                            ) : companyLogo ? (
                                <div className="relative">
                                    <Image
                                        src={companyLogo}
                                        alt="Logo Perusahaan"
                                        width={160}
                                        height={96}
                                        className="h-24 w-auto object-contain mx-auto"
                                        unoptimized
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-transparent group-hover:text-slate-600 transition-colors duration-200 text-sm bg-white/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100">
                                            edit
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Link href="/" className="flex items-center gap-2">
                                        <Image
                                            src="/images/logo-color.png"
                                            alt="ALI Logo"
                                            width={160}
                                            height={96}
                                            className="h-24 w-auto object-contain"
                                        />
                                    </Link>
                                    {/* Upload hint overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-transparent group-hover:text-slate-600 transition-colors duration-200 text-sm bg-white/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100">
                                            add_photo_alternate
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Uploading overlay */}
                            {uploading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-6 w-6 border-2 border-slate-200 border-t-[#2a6ba7] rounded-full animate-spin" />
                                        <span className="text-xs font-bold text-slate-500">Mengunggah...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Context Menu */}
                        {showLogoMenu && !uploading && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg shadow-slate-200/80 border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                <button
                                    onClick={() => {
                                        setShowLogoMenu(false);
                                        fileInputRef.current?.click();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px] text-[#2a6ba7]">upload</span>
                                    {companyLogo ? "Ganti Logo" : "Upload Logo"}
                                </button>
                                {companyLogo && (
                                    <button
                                        onClick={handleLogoDelete}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-100"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        Hapus Logo
                                    </button>
                                )}
                                <div className="px-4 py-2 border-t border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400">
                                        JPG, PNG, WebP • Maks 2MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
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
