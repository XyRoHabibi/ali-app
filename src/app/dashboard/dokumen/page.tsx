"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// ── Interfaces ──────────────────────────────────────────
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
    name: string;
    jabatan: string;
    masaJabatan: string | null;
    akhirMenjabat: string | null;
    status: string;
}

interface Agreement {
    id: string;
    title: string;
    validUntil: string | null;
    status: string;
}

interface TaxReport {
    id: string;
    title: string;
    description: string | null;
    status: string;
    date: string | null;
}

interface CompanyData {
    id: string;
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

// ── Helpers ─────────────────────────────────────────────
const CATEGORIES = ["Semua", "Legalitas", "Perpajakan", "Perizinan", "Sertifikat"];

const DOC_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
    Legalitas: { icon: "gavel", bg: "bg-purple-50", color: "text-purple-500" },
    Perpajakan: { icon: "account_balance_wallet", bg: "bg-orange-50", color: "text-orange-500" },
    Perizinan: { icon: "verified_user", bg: "bg-blue-50", color: "text-blue-600" },
    Sertifikat: { icon: "workspace_premium", bg: "bg-amber-50", color: "text-amber-600" },
};

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

function formatDate(dateStr: string | null) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getDocIcon(category: string | null) {
    return DOC_ICONS[category || ""] || { icon: "description", bg: "bg-slate-50", color: "text-slate-500" };
}

function getDirectorColor(jabatan: string) {
    if (jabatan.toLowerCase().includes("komisaris")) return { bg: "bg-purple-100", text: "text-purple-600", bar: "bg-purple-600" };
    return { bg: "bg-blue-100", text: "text-blue-600", bar: "bg-blue-600" };
}

function getTenureInfo(akhirMenjabat: string | null) {
    if (!akhirMenjabat) return { remaining: "Tidak ditentukan", percent: 0, expired: false };
    const end = new Date(akhirMenjabat);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return { remaining: "Sudah Berakhir", percent: 100, expired: true };
    const totalDays = diff / (1000 * 60 * 60 * 24);
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const remaining = years > 0 ? `${years} Tahun ${months} Bulan Tersisa` : `${months} Bulan Tersisa`;
    // assume 5yr standard max
    const pct = Math.max(0, Math.min(100, 100 - (totalDays / (5 * 365)) * 100));
    return { remaining, percent: Math.round(pct), expired: false };
}

// ── Main ────────────────────────────────────────────────
export default function DokumenPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#2a6ba7] border-t-transparent rounded-full" /></div>}>
            <DokumenContent />
        </Suspense>
    );
}

function DokumenContent() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [userDocs, setUserDocs] = useState<UserDoc[]>([]);
    const [storage, setStorage] = useState<StorageInfo>({ used: 0, limit: 52428800, isPro: false });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassEmail, setShowPassEmail] = useState(false);
    const [showPassOss, setShowPassOss] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const filterAppId = searchParams.get("appId");

    // Auto-select from URL param
    useEffect(() => {
        if (filterAppId) setSelectedAppId(filterAppId);
    }, [filterAppId]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [appRes, docRes] = await Promise.all([
                fetch("/api/hono/applications"),
                fetch("/api/hono/user-documents"),
            ]);
            if (appRes.ok) { const d = await appRes.json(); setApplications(d.applications || []); }
            if (docRes.ok) { const d = await docRes.json(); setUserDocs(d.documents || []); setStorage(d.storage || { used: 0, limit: 52428800, isPro: false }); }
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setMessage("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/hono/user-documents", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok) { setMessage("Dokumen berhasil diunggah!"); fetchAll(); }
            else { setMessage(data.error || "Gagal mengunggah"); }
        } catch { setMessage("Terjadi kesalahan saat upload"); }
        finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; setTimeout(() => setMessage(""), 4000); }
    };

    const handleDeleteUserDoc = async (docId: string) => {
        if (!confirm("Hapus dokumen ini?")) return;
        try {
            const res = await fetch(`/api/hono/user-documents/${docId}`, { method: "DELETE" });
            if (res.ok) { setMessage("Dihapus!"); fetchAll(); }
        } catch { setMessage("Gagal menghapus"); }
        setTimeout(() => setMessage(""), 3000);
    };

    // ── Derived data ────────────────────────────────────
    const activeApp = selectedAppId ? applications.find(a => a.id === selectedAppId) : null;
    const companyData = activeApp?.companyData || null;

    const activeDocs = activeApp?.documents || [];
    const filteredDocs = activeDocs.filter(doc => {
        const matchSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = activeCategory === "Semua" || doc.category === activeCategory;
        return matchSearch && matchCat;
    });

    const directors = companyData?.directors || [];
    const agreements = companyData?.agreements || [];
    const taxReports = companyData?.taxReports || [];
    const storagePercent = Math.round((storage.used / storage.limit) * 100);

    // ── Render ──────────────────────────────────────────
    return (
        <div className="p-6 lg:p-10 flex-1">
            {/* Toast */}
            {message && (
                <div className="fixed top-6 right-6 z-50 bg-[#2a6ba7] text-white px-6 py-3 rounded-xl shadow-xl font-bold animate-[fadeIn_0.3s_ease]">
                    {message}
                </div>
            )}

            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center text-slate-500 text-sm gap-2 mb-6">
                <Link href="/dashboard" className="hover:text-[#2a6ba7] transition-colors">Dashboard</Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                {selectedAppId && activeApp ? (
                    <>
                        <button onClick={() => { setSelectedAppId(null); router.push(pathname); }} className="hover:text-[#2a6ba7] transition-colors">Brankas Dokumen</button>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-[#2a6ba7] font-bold">{activeApp.name || activeApp.service.name}</span>
                    </>
                ) : (
                    <span className="text-[#2a6ba7] font-bold">Brankas Dokumen</span>
                )}
            </div>

            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        {selectedAppId && activeApp ? (
                            <>
                                <button
                                    onClick={() => { setSelectedAppId(null); router.push(pathname); }}
                                    className="text-sm text-[#2a6ba7] font-medium flex items-center gap-1 hover:underline mb-1"
                                >
                                    <span className="material-symbols-outlined text-base">arrow_back</span>
                                    Kembali ke Pilihan Layanan
                                </button>
                                <h1 className="text-2xl font-bold tracking-tight">{activeApp.name || activeApp.service.name}</h1>
                                <p className="text-slate-500 max-w-2xl">
                                    {activeApp.service.name} • Dibuat {formatDate(activeApp.createdAt)}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold tracking-tight">Brankas Dokumen</h1>
                                <p className="text-slate-500 max-w-2xl">
                                    Akses dan kelola semua dokumen legalitas perusahaan Anda di satu tempat yang aman dan terenkripsi.
                                </p>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-[#2a6ba7] hover:bg-[#1e5a8a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[20px]">{uploading ? "hourglass_empty" : "upload_file"}</span>
                        {uploading ? "Mengunggah..." : "Unggah Dokumen"}
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" onChange={handleUpload} />
                </div>

                {/* Search & Filters — only show when a service is selected */}
                {selectedAppId && (
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="bg-white rounded-lg border border-slate-200 flex items-center p-1 shadow-sm">
                            <span className="material-symbols-outlined text-slate-400 pl-3">search</span>
                            <input
                                className="border-none bg-transparent focus:ring-0 text-sm w-64 text-slate-900 placeholder-slate-400 outline-none px-2 py-1.5"
                                placeholder="Cari dokumen (NIB, NPWP...)"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat
                                    ? "bg-[#2a6ba7] text-white"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                                <div className="h-12 w-12 bg-slate-100 rounded-xl mb-4" />
                                <div className="h-5 bg-slate-100 rounded w-40 mb-2" />
                                <div className="h-3 bg-slate-100 rounded w-24 mb-4" />
                                <div className="h-8 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                ) : !selectedAppId ? (
                    /* ═══════ SERVICE PICKER OVERVIEW ═══════ */
                    <div className="space-y-8">
                        {applications.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">folder_off</span>
                                <p className="text-lg font-bold text-slate-600 mb-1">Belum ada layanan aktif</p>
                                <p className="text-sm text-slate-400">Layanan akan muncul di sini setelah Anda mengajukan permohonan.</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-slate-500 font-medium">Pilih layanan untuk melihat dokumen dan detail perusahaan:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {applications.map(app => {
                                        const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                                        const docCount = app.documents.length;
                                        const hasCompany = !!app.companyData;
                                        return (
                                            <button
                                                key={app.id}
                                                onClick={() => { setSelectedAppId(app.id); setSearchQuery(""); setActiveCategory("Semua"); router.push(`${pathname}?appId=${app.id}`); }}
                                                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#2a6ba7]/30 transition-all text-left group relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#2a6ba7]/5 rounded-bl-full -mr-6 -mt-6 group-hover:bg-[#2a6ba7]/10 transition-colors" />
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="h-12 w-12 rounded-xl bg-[#2a6ba7]/10 flex items-center justify-center group-hover:bg-[#2a6ba7]/20 transition-colors flex-shrink-0">
                                                        <span className="material-symbols-outlined text-[#2a6ba7]">business</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-base truncate group-hover:text-[#2a6ba7] transition-colors">{app.name || app.service.name}</h3>
                                                        <p className="text-xs text-slate-400">{app.service.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                                        <span className="material-symbols-outlined text-xs mr-1 align-middle">{status.icon}</span>
                                                        {status.label}
                                                    </span>
                                                    <span className="text-xs text-slate-400">{formatDate(app.createdAt)}</span>
                                                </div>
                                                <div className="flex gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">description</span>
                                                        {docCount} dokumen
                                                    </span>
                                                    {hasCompany && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">domain</span>
                                                            Profil lengkap
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-medium text-[#2a6ba7] opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span>Lihat Detail</span>
                                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* User-uploaded docs (Brankas) — always visible in overview */}
                        {userDocs.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">folder_special</span>
                                    Brankas Pribadi
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {userDocs.map(doc => (
                                        <div key={doc.id} className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border-slate-200">
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className="bg-slate-50 p-2.5 rounded-lg text-slate-500">
                                                    <span className="material-symbols-outlined">{doc.fileType?.includes("pdf") ? "picture_as_pdf" : doc.fileType?.includes("image") ? "image" : "description"}</span>
                                                </div>
                                                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">Brankas</span>
                                            </div>
                                            <h3 className="font-bold text-lg mb-1 line-clamp-1">{doc.name}</h3>
                                            <p className="text-xs text-slate-400 mb-3 font-mono">{formatBytes(doc.fileSize)}</p>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                <span>{formatDate(doc.createdAt)}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">visibility</span> Lihat
                                                </a>
                                                <button onClick={() => handleDeleteUserDoc(doc.id)} className="flex-1 border border-red-200 hover:bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">delete</span> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ═══════ SELECTED SERVICE DETAIL VIEW ═══════ */
                    <div className="space-y-8">

                        {/* ═══════ DOCUMENT CARDS ═══════ */}
                        {filteredDocs.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">note_stack</span>
                                <p className="text-lg font-bold text-slate-600 mb-1">Belum ada dokumen</p>
                                <p className="text-sm text-slate-400">Dokumen akan tersedia setelah admin mengunggahnya untuk layanan ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {filteredDocs.map(doc => {
                                    const icon = getDocIcon(doc.category);
                                    return (
                                        <div key={doc.id} className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border-slate-200">
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className={`${icon.bg} p-2.5 rounded-lg ${icon.color}`}>
                                                    <span className="material-symbols-outlined">{icon.icon}</span>
                                                </div>
                                                <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                    Valid
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg mb-1 line-clamp-1">{doc.name}</h3>
                                            <p className="text-xs text-slate-400 mb-3 font-mono">{doc.category || "Umum"} • {formatBytes(doc.fileSize)}</p>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                <span>{formatDate(doc.createdAt)}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">visibility</span> Lihat
                                                </a>
                                                <a
                                                    href={doc.fileUrl}
                                                    download
                                                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">download</span> Unduh
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}

                        {/* ═══════ DIRECTORS SECTION ═══════ */}
                        {directors.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold mb-4">Masa Jabatan Direktur &amp; Komisaris</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {directors.map(d => {
                                        const colors = getDirectorColor(d.jabatan);
                                        const tenure = getTenureInfo(d.akhirMenjabat);
                                        const initials = d.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                                        return (
                                            <div key={d.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 ${colors.bg} rounded-full flex items-center justify-center ${colors.text} font-bold`}>
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-base">{d.name}</h3>
                                                            <p className="text-xs text-slate-500">{d.jabatan}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{d.status}</span>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-slate-500">Masa Jabatan</span>
                                                        <span className={`font-medium ${tenure.expired ? "text-red-600" : colors.text}`}>
                                                            {tenure.remaining}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                                                        <div
                                                            className={`${tenure.expired ? "bg-red-500" : colors.bar} h-2.5 rounded-full transition-all`}
                                                            style={{ width: `${tenure.percent}%` }}
                                                        />
                                                    </div>
                                                    {d.akhirMenjabat && (
                                                        <div className="mt-2 text-xs text-right text-slate-400">
                                                            Berlaku hingga: {formatDate(d.akhirMenjabat)}
                                                        </div>
                                                    )}
                                                </div>
                                                {d.masaJabatan && (
                                                    <div className="flex gap-2 mt-auto">

                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ═══════ 3-COL LAYOUT: Agreements + Tax | Data Penting ═══════ */}
                        {companyData && (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* LEFT COL */}
                                <div className="xl:col-span-2 space-y-6">

                                    {/* Agreements Table */}
                                    {agreements.length > 0 && (
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                                <h2 className="font-bold text-lg">Daftar Perjanjian</h2>
                                                <span className="text-[#2a6ba7] text-sm font-medium">{agreements.length} perjanjian</span>
                                            </div>
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
                                                    {agreements.map(ag => (
                                                        <tr key={ag.id} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-6 py-4 font-medium">{ag.title}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ag.status === "Aktif"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-red-100 text-red-700"
                                                                    }`}>
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${ag.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"}`} />
                                                                    {ag.status}
                                                                </span>
                                                            </td>
                                                            <td className={`px-6 py-4 ${ag.status !== "Aktif" ? "text-red-500 font-medium" : "text-slate-500"}`}>
                                                                {formatDate(ag.validUntil)}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button className="text-slate-400 hover:text-[#2a6ba7]">
                                                                    <span className="material-symbols-outlined text-lg">more_vert</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Tax / Permits Timeline */}
                                    {taxReports.length > 0 && (
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h2 className="font-bold text-lg">Perizinan &amp; Pajak Bulanan</h2>
                                                <span className="text-xs text-slate-400">{new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
                                            </div>
                                            <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                                                {taxReports.map(tax => (
                                                    <div key={tax.id} className="relative">
                                                        <div className={`absolute -left-[21px] top-1 bg-white border-2 ${tax.status === "SELESAI" ? "border-emerald-500" : "border-orange-500 animate-pulse"
                                                            } w-3 h-3 rounded-full`} />
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                            <div>
                                                                <div className={`text-xs font-bold mb-1 ${tax.status === "SELESAI" ? "text-emerald-600" : "text-orange-600"}`}>
                                                                    {tax.status}
                                                                </div>
                                                                <h4 className="font-medium">{tax.title}</h4>
                                                                <p className="text-xs text-slate-500">{tax.description || ""}</p>
                                                            </div>
                                                            <div className={`mt-2 sm:mt-0 px-3 py-1 rounded text-sm font-mono ${tax.status === "SELESAI"
                                                                ? "bg-slate-100 text-slate-600"
                                                                : "bg-orange-50 border border-orange-100 text-orange-600"
                                                                }`}>
                                                                {formatDate(tax.date)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT COL: Data Penting */}
                                <div className="xl:col-span-1 space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400">lock</span>
                                            Data Penting
                                        </h2>
                                        <div className="grid gap-4">
                                            {/* Email */}
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="bg-white p-2 rounded-md shadow-sm">
                                                        <span className="material-symbols-outlined text-[#2a6ba7] text-sm">email</span>
                                                    </div>
                                                    <button
                                                        onClick={() => { if (companyData?.emailPerusahaan) navigator.clipboard.writeText(companyData.emailPerusahaan); }}
                                                        className="text-slate-400 hover:text-[#2a6ba7]"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">content_copy</span>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-1">Email Perusahaan</p>
                                                <p className="font-mono text-sm truncate">{companyData.emailPerusahaan || "-"}</p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <p className="text-xs text-slate-400">Password Email</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs tracking-widest text-slate-600">
                                                            {showPassEmail ? (companyData.emailPassword || "-") : "••••••••"}
                                                        </span>
                                                        <button onClick={() => setShowPassEmail(!showPassEmail)}>
                                                            <span className="material-symbols-outlined text-xs text-slate-400 cursor-pointer">
                                                                {showPassEmail ? "visibility" : "visibility_off"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* OSS */}
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="bg-white p-2 rounded-md shadow-sm">
                                                        <span className="material-symbols-outlined text-purple-500 text-sm">vpn_key</span>
                                                    </div>
                                                    <button
                                                        onClick={() => { if (companyData?.akunOss) navigator.clipboard.writeText(companyData.akunOss); }}
                                                        className="text-slate-400 hover:text-[#2a6ba7]"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">content_copy</span>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-1">Akun OSS / Perizinan</p>
                                                <p className="font-mono text-sm">{companyData.akunOss || "-"}</p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <p className="text-xs text-slate-400">Password</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs tracking-widest text-slate-600">
                                                            {showPassOss ? (companyData.akunOssPassword || "-") : "••••••••"}
                                                        </span>
                                                        <button onClick={() => setShowPassOss(!showPassOss)}>
                                                            <span className="material-symbols-outlined text-xs text-slate-400 cursor-pointer">
                                                                {showPassOss ? "visibility" : "visibility_off"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Storage Info */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                        <h3 className="font-bold text-sm mb-3 text-slate-600">Penyimpanan Brankas</h3>
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-lg font-black">{formatBytes(storage.used)}</span>
                                            <span className="text-xs text-slate-400">/ {formatBytes(storage.limit)}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${storagePercent > 80 ? "bg-red-500" : "bg-[#2a6ba7]"}`}
                                                style={{ width: `${Math.min(storagePercent, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="bg-gradient-to-br from-[#2a6ba7] to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl" />
                                        <h3 className="font-bold text-lg mb-2 relative z-10">Butuh Bantuan Hukum?</h3>
                                        <p className="text-blue-100 text-sm mb-6 relative z-10">Tim legal kami siap membantu Anda 24/7 terkait dokumen ini.</p>
                                        <button className="w-full bg-white text-[#2a6ba7] font-bold py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2 relative z-10">
                                            <span className="material-symbols-outlined">chat_bubble</span>
                                            Chat dengan Tim
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-4 border-t border-slate-200 pt-6 pb-8">
                    <p className="text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} PT Akses Legal Indonesia. Hak cipta dilindungi undang-undang.
                        <br />
                        <a href="#" className="hover:text-[#2a6ba7] transition-colors">Syarat Ketentuan</a> • <a href="#" className="hover:text-[#2a6ba7] transition-colors">Kebijakan Privasi</a>
                    </p>
                </footer>
            </div>
        </div>
    );
}
