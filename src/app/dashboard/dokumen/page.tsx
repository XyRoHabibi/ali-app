"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface ApplicationDoc {
    id: string;
    name: string;
    fileUrl: string;
    fileSize: number;
    fileType: string | null;
    category: string | null;
    adminNote: string | null;
    createdAt: string;
}



interface Director {
    id: string;
    companyDataId: string;
    name: string;
    jabatan: string;
    masaJabatan: string | null;
    akhirMenjabat: string | null;
    status: string;
}

interface Agreement {
    id: string;
    companyDataId: string;
    title: string;
    validUntil: string | null;
    status: string;
}

interface TaxReport {
    id: string;
    companyDataId: string;
    title: string;
    description: string | null;
    status: string;
    date: string | null;
}

interface CompanyData {
    id: string;
    applicationId: string;
    emailPerusahaan: string | null;
    emailPassword: string | null;
    akunOss: string | null;
    akunOssPassword: string | null;
    directors: Director[];
    agreements: Agreement[];
    taxReports: TaxReport[];
}

interface Application {
    id: string;
    name: string;
    status: string;
    estimate: string | null;
    createdAt: string;
    service: { id: string; name: string };
    documents: ApplicationDoc[];
    companyData: CompanyData | null;
}

interface UserDoc {
    id: string;
    name: string;
    fileUrl: string;
    fileSize: number;
    fileType: string | null;
    createdAt: string;
}

interface StorageInfo {
    used: number;
    limit: number;
    isPro: boolean;
}

const CATEGORIES = ["Semua", "Legalitas", "Perpajakan", "Perizinan", "Sertifikat"];

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    PENDING: { label: "Menunggu", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: "schedule" },
    PROCESS: { label: "Diproses", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: "sync" },
    COMPLETED: { label: "Selesai", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: "check_circle" },
    CANCELLED: { label: "Dibatalkan", color: "bg-red-500/10 text-red-600 border-red-200", icon: "cancel" },
};

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function getFileIcon(fileType: string | null) {
    if (fileType?.includes("pdf")) return { icon: "picture_as_pdf", color: "text-red-500", bg: "bg-red-500/10" };
    if (fileType?.includes("image")) return { icon: "image", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (fileType?.includes("word") || fileType?.includes("document")) return { icon: "article", color: "text-indigo-500", bg: "bg-indigo-500/10" };
    return { icon: "description", color: "text-slate-500", bg: "bg-slate-100" };
}

export default function DokumenPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DokumenContent />
        </Suspense>
    );
}

function DokumenContent() {
    const [activeTab, setActiveTab] = useState<"layanan" | "brankas">("layanan");
    const [applications, setApplications] = useState<Application[]>([]);
    const [userDocs, setUserDocs] = useState<UserDoc[]>([]);
    const [storage, setStorage] = useState<StorageInfo>({ used: 0, limit: 52428800, isPro: false });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const searchParams = useSearchParams();
    const filterAppId = searchParams.get("appId");

    const fetchLayanan = useCallback(async () => {
        try {
            const res = await fetch("/api/hono/applications");
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications || []);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        }
    }, []);

    const fetchBrankas = useCallback(async () => {
        try {
            const res = await fetch("/api/hono/user-documents");
            if (res.ok) {
                const data = await res.json();
                setUserDocs(data.documents || []);
                setStorage(data.storage || { used: 0, limit: 52428800, isPro: false });
            }
        } catch (err) {
            console.error("Failed to fetch user docs:", err);
        }
    }, []);

    useEffect(() => {
        async function load() {
            setLoading(true);
            await Promise.all([fetchLayanan(), fetchBrankas()]);
            setLoading(false);
        }
        load();
    }, [fetchLayanan, fetchBrankas]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/hono/user-documents", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setMessage("Dokumen berhasil diunggah!");
                fetchBrankas();
            } else {
                setMessage(data.error || "Gagal mengunggah dokumen");
            }
        } catch {
            setMessage("Terjadi kesalahan saat upload");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setTimeout(() => setMessage(""), 4000);
        }
    };

    const handleDeleteUserDoc = async (docId: string) => {
        if (!confirm("Hapus dokumen ini?")) return;
        try {
            const res = await fetch(`/api/hono/user-documents/${docId}`, { method: "DELETE" });
            if (res.ok) {
                setMessage("Dokumen berhasil dihapus!");
                fetchBrankas();
            } else {
                setMessage("Gagal menghapus dokumen");
            }
        } catch {
            setMessage("Terjadi kesalahan");
        }
        setTimeout(() => setMessage(""), 3000);
    };

    // Flatten all application documents for filtering
    const allAppDocs = applications.flatMap(app =>
        app.documents.map(doc => ({
            ...doc,
            applicationId: app.id,
            appName: app.name || app.service.name,
            serviceName: app.service.name,
            appStatus: app.status
        }))
    );

    const filteredAppDocs = allAppDocs.filter(doc => {
        const matchSearch = searchQuery === "" || doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.appName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = activeCategory === "Semua" || doc.category === activeCategory;
        const matchAppId = !filterAppId || doc.applicationId === filterAppId;
        return matchSearch && matchCategory && matchAppId;
    });

    const filteredUserDocs = userDocs.filter(doc =>
        searchQuery === "" || doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const storagePercent = Math.round((storage.used / storage.limit) * 100);

    return (
        <>
            {/* Toast Message */}
            {message && (
                <div className="fixed top-6 right-6 z-50 bg-[#2a6ba7] text-white px-6 py-3 rounded-xl shadow-xl font-bold animate-[fadeIn_0.3s_ease]">
                    {message}
                </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <span className="material-symbols-outlined text-base">home</span>
                <span>Dashboard</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-700 font-bold">Dokumen</span>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Brankas Dokumen</h1>
                        <p className="text-slate-500 max-w-2xl">
                            Akses dan kelola semua dokumen legalitas perusahaan Anda di satu tempat yang aman.
                        </p>
                    </div>
                    {activeTab === "brankas" && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-[#2a6ba7] hover:bg-[#1e5a8a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {uploading ? "hourglass_empty" : "upload_file"}
                            </span>
                            {uploading ? "Mengunggah..." : "Unggah Dokumen"}
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                        onChange={handleUpload}
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                    <button
                        onClick={() => setActiveTab("layanan")}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "layanan"
                            ? "bg-white text-[#2a6ba7] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">verified</span>
                            Dokumen Layanan
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("brankas")}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "brankas"
                            ? "bg-white text-[#2a6ba7] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">lock</span>
                            Brankas Saya
                            <span className="bg-[#2a6ba7]/10 text-[#2a6ba7] text-xs px-2 py-0.5 rounded-full">
                                {userDocs.length}
                            </span>
                        </span>
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[240px] max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder={activeTab === "layanan" ? "Cari dokumen layanan..." : "Cari dokumen pribadi..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none transition-all"
                        />
                    </div>
                    {activeTab === "layanan" && (
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat
                                        ? "bg-[#2a6ba7] text-white shadow-md shadow-[#2a6ba7]/20"
                                        : "bg-white text-slate-500 border border-slate-200 hover:border-[#2a6ba7]/30 hover:text-[#2a6ba7]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ===== TAB: DOKUMEN LAYANAN ===== */}
                {activeTab === "layanan" && (
                    <div className="space-y-6">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                                        <div className="h-5 bg-slate-100 rounded w-40 mb-3" />
                                        <div className="h-4 bg-slate-100 rounded w-24 mb-4" />
                                        <div className="h-10 bg-slate-100 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredAppDocs.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">
                                    {searchQuery || activeCategory !== "Semua" ? "search_off" : "note_stack"}
                                </span>
                                <p className="text-lg font-bold text-slate-600 mb-1">
                                    {searchQuery || activeCategory !== "Semua" ? "Tidak ada dokumen yang cocok" : "Belum ada dokumen layanan"}
                                </p>
                                <p className="text-sm text-slate-400">
                                    {searchQuery || activeCategory !== "Semua"
                                        ? "Coba ubah kata kunci atau filter pencarian Anda."
                                        : "Dokumen akan tersedia setelah admin mengunggahnya untuk layanan Anda."
                                    }
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Summary cards for each application */}
                                {applications.filter(app => {
                                    const hasDocs = app.documents.length > 0 || searchQuery === "";
                                    const matchAppId = !filterAppId || app.id === filterAppId;
                                    return hasDocs && matchAppId;
                                }).map(app => {
                                    const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                                    const docs = app.documents.filter(doc => {
                                        const matchSearch = searchQuery === "" || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchCat = activeCategory === "Semua" || doc.category === activeCategory;
                                        return matchSearch && matchCat;
                                    });
                                    if (docs.length === 0 && searchQuery !== "") return null;
                                    return (
                                        <div key={app.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                            {/* App Header */}
                                            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-11 w-11 rounded-xl bg-[#2a6ba7]/10 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[#2a6ba7]">business</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black">{app.name || app.service.name}</h3>
                                                            <p className="text-xs text-slate-400">{app.service.name} • {formatDate(app.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${status.color}`}>
                                                            <span className="material-symbols-outlined text-xs mr-1 align-middle">{status.icon}</span>
                                                            {status.label}
                                                        </span>
                                                        <span className="text-xs text-slate-400 font-bold">{docs.length} dokumen</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Company Profile (Expanded if filter match) */}
                                            {app.id === filterAppId && app.companyData && (
                                                <CompanyProfileView companyData={app.companyData} />
                                            )}

                                            {/* Documents Grid */}
                                            {docs.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
                                                    {docs.map(doc => {
                                                        const fileIcon = getFileIcon(doc.fileType);
                                                        return (
                                                            <div
                                                                key={doc.id}
                                                                className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-[#2a6ba7]/30 hover:shadow-md transition-all group"
                                                            >
                                                                <div className="flex items-start gap-3 mb-3">
                                                                    <div className={`h-10 w-10 rounded-lg ${fileIcon.bg} flex items-center justify-center flex-shrink-0`}>
                                                                        <span className={`material-symbols-outlined ${fileIcon.color}`}>{fileIcon.icon}</span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-bold text-sm truncate">{doc.name}</p>
                                                                        <p className="text-xs text-slate-400">{formatBytes(doc.fileSize)} • {doc.category || "Umum"}</p>
                                                                    </div>
                                                                </div>
                                                                {doc.adminNote && (
                                                                    <p className="text-xs text-slate-400 italic mb-3 line-clamp-2">💬 {doc.adminNote}</p>
                                                                )}
                                                                <div className="flex gap-2">
                                                                    <a
                                                                        href={doc.fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex-1 bg-white hover:bg-[#2a6ba7]/5 text-slate-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-slate-200"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                                                        Lihat
                                                                    </a>
                                                                    <a
                                                                        href={doc.fileUrl}
                                                                        download
                                                                        className="flex-1 bg-[#2a6ba7] hover:bg-[#1e5a8a] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">download</span>
                                                                        Unduh
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <span className="material-symbols-outlined text-3xl text-slate-200 mb-2 block">note_stack</span>
                                                    <p className="text-sm text-slate-400">Belum ada dokumen untuk layanan ini</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                )}

                {/* ===== TAB: BRANKAS SAYA ===== */}
                {activeTab === "brankas" && (
                    <div className="space-y-6">
                        {/* Storage Quota Card */}
                        <div className="bg-gradient-to-br from-[#2a6ba7] to-[#1e3a5f] rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-2xl">cloud</span>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg">Penyimpanan</h3>
                                            <p className="text-sm text-white/70">
                                                {storage.isPro ? "Pro Plan" : "Free Plan"}
                                            </p>
                                        </div>
                                    </div>
                                    {!storage.isPro && (
                                        <button className="bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/20">
                                            ⚡ Upgrade Pro
                                        </button>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-bold">{formatBytes(storage.used)} digunakan</span>
                                        <span className="text-white/70">{formatBytes(storage.limit)}</span>
                                    </div>
                                    <div className="h-3 bg-white/15 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${storagePercent > 80 ? "bg-red-400" : storagePercent > 50 ? "bg-amber-400" : "bg-emerald-400"
                                                }`}
                                            style={{ width: `${Math.min(storagePercent, 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-white/50">
                                    {storagePercent}% terpakai • {formatBytes(storage.limit - storage.used)} tersisa
                                </p>
                            </div>
                        </div>

                        {/* User Documents */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse">
                                        <div className="h-5 bg-slate-100 rounded w-40 mb-3" />
                                        <div className="h-4 bg-slate-100 rounded w-24" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredUserDocs.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">
                                    {searchQuery ? "search_off" : "cloud_upload"}
                                </span>
                                <p className="text-lg font-bold text-slate-600 mb-1">
                                    {searchQuery ? "Tidak ada dokumen yang cocok" : "Brankas masih kosong"}
                                </p>
                                <p className="text-sm text-slate-400 mb-4">
                                    {searchQuery
                                        ? "Coba ubah kata kunci pencarian Anda."
                                        : "Unggah dokumen pribadi Anda untuk disimpan dengan aman."
                                    }
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-[#2a6ba7] hover:bg-[#1e5a8a] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">upload_file</span>
                                        Unggah Dokumen Pertama
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filteredUserDocs.map(doc => {
                                    const fileIcon = getFileIcon(doc.fileType);
                                    return (
                                        <div
                                            key={doc.id}
                                            className="bg-white rounded-xl p-5 border border-slate-200 hover:border-[#2a6ba7]/30 hover:shadow-lg transition-all group"
                                        >
                                            <div className="flex items-start gap-3 mb-4">
                                                <div className={`h-12 w-12 rounded-xl ${fileIcon.bg} flex items-center justify-center flex-shrink-0`}>
                                                    <span className={`material-symbols-outlined text-2xl ${fileIcon.color}`}>{fileIcon.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold truncate">{doc.name}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{formatBytes(doc.fileSize)} • {formatDate(doc.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                    Lihat
                                                </a>
                                                <a
                                                    href={doc.fileUrl}
                                                    download
                                                    className="flex-1 bg-[#2a6ba7]/10 hover:bg-[#2a6ba7]/20 text-[#2a6ba7] py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">download</span>
                                                    Unduh
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteUserDoc(doc.id)}
                                                    className="h-[38px] w-[38px] bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Upload Area (when brankas is empty or always visible) */}
                        {filteredUserDocs.length > 0 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 hover:border-[#2a6ba7]/40 rounded-2xl p-8 text-center cursor-pointer transition-all group"
                            >
                                <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-[#2a6ba7]/50 transition-colors mb-2 block">
                                    add_circle
                                </span>
                                <p className="text-sm text-slate-400 group-hover:text-slate-600 font-bold transition-colors">
                                    Klik atau seret file ke sini untuk mengunggah
                                </p>
                                <p className="text-xs text-slate-300 mt-1">
                                    PDF, JPG, PNG, DOC/DOCX • Maks. 5MB per file
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function CompanyProfileView({ companyData }: { companyData: CompanyData }) {
    return (
        <div className="bg-slate-50 border-y border-slate-200 p-6 space-y-8 animate-[fadeIn_0.5s_ease]">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#2a6ba7]">domain</span>
                <h3 className="font-bold text-slate-700">Profil Perusahaan & Legalitas</h3>
            </div>

            {/* Directors */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Direksi & Komisaris</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companyData.directors.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Belum ada data direksi.</p>
                    ) : (
                        companyData.directors.map(d => (
                            <div key={d.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-[#2a6ba7]/30 transition-all">
                                <div className="h-10 w-10 rounded-full bg-blue-50 text-[#2a6ba7] flex items-center justify-center font-bold text-sm border border-blue-100">
                                    {d.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{d.name}</p>
                                    <p className="text-xs text-slate-500">{d.jabatan}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${d.status === 'Aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{d.status}</span>
                                        {d.akhirMenjabat && <span className="text-[10px] text-slate-400">Exp: {new Date(d.akhirMenjabat).getFullYear()}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Agreements & Credentials */}
                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Perjanjian & Legalitas</h4>
                        {companyData.agreements.length === 0 ? (
                            <p className="text-sm text-slate-400 italic bg-white p-4 rounded-xl border border-dashed border-slate-200">Belum ada perjanjian tercatat.</p>
                        ) : (
                            <ul className="space-y-2">
                                {companyData.agreements.map(ag => (
                                    <li key={ag.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center group hover:border-[#2a6ba7]/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-[#2a6ba7]">description</span>
                                            <span className="text-sm font-medium">{ag.title}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold block w-fit ml-auto mb-0.5 ${ag.status === 'Aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                {ag.status}
                                            </span>
                                            {ag.validUntil && <span className="text-[10px] text-slate-400">Valid: {new Date(ag.validUntil).toLocaleDateString("id-ID")}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-4xl text-[#2a6ba7]">email</span>
                            </div>
                            <p className="text-xs font-bold text-[#2a6ba7] mb-1 uppercase tracking-wider">Email Perusahaan</p>
                            <p className="font-mono text-sm font-medium text-slate-700 select-all">{companyData.emailPerusahaan || "-"}</p>
                            {companyData.emailPassword && (
                                <div className="mt-2 pt-2 border-t border-blue-100 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400">Password</span>
                                    <span className="font-mono text-xs text-slate-600 bg-white/50 px-2 py-0.5 rounded select-all">{companyData.emailPassword}</span>
                                </div>
                            )}
                        </div>
                        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-4xl text-purple-600">vpn_key</span>
                            </div>
                            <p className="text-xs font-bold text-purple-600 mb-1 uppercase tracking-wider">Akun OSS</p>
                            <p className="font-mono text-sm font-medium text-slate-700 select-all">{companyData.akunOss || "-"}</p>
                            {companyData.akunOssPassword && (
                                <div className="mt-2 pt-2 border-t border-purple-100 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400">Password</span>
                                    <span className="font-mono text-xs text-slate-600 bg-white/50 px-2 py-0.5 rounded select-all">{companyData.akunOssPassword}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tax Reports */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Pajak & Perizinan (History)</h4>
                    {companyData.taxReports.length === 0 ? (
                        <p className="text-sm text-slate-400 italic bg-white p-4 rounded-xl border border-dashed border-slate-200">Belum ada history laporan.</p>
                    ) : (
                        <div className="space-y-4 relative pl-2">
                            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>
                            {companyData.taxReports.slice(0, 5).map(tax => (
                                <div key={tax.id} className="relative pl-6 group">
                                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${tax.status === 'SELESAI' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm group-hover:border-[#2a6ba7]/30 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-slate-700">{tax.title}</p>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tax.status === 'SELESAI' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {tax.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">{tax.description || "Tidak ada keterangan"}</p>
                                        {tax.date && <p className="text-[10px] text-slate-400 font-mono bg-slate-50 w-fit px-2 py-0.5 rounded">{new Date(tax.date).toLocaleDateString("id-ID", { dateStyle: 'full' })}</p>}
                                    </div>
                                </div>
                            ))}
                            {companyData.taxReports.length > 5 && (
                                <div className="pl-6 pt-2">
                                    <button className="text-xs font-bold text-[#2a6ba7] hover:underline bg-blue-50 px-3 py-1.5 rounded-full">
                                        + {companyData.taxReports.length - 5} history lainnya
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
