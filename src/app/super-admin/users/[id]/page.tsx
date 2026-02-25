"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Application {
    id: string;
    name: string;
    status: string;
    estimate: string | null;
    createdAt: string;
    service: { id: string; name: string };
    documents: ApplicationDoc[];
}

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

interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: string;
    alamat: string | null;
    telepon: string | null;
    storageUsed: number;
    storageLimit: number;
    isPro: boolean;
    createdAt: string;
    applications: Application[];
}

interface Service {
    id: string;
    name: string;
    description: string | null;
    price: number;
}

const STATUS_OPTIONS = [
    { value: "PENDING", label: "Menunggu", color: "bg-yellow-500/10 text-yellow-600" },
    { value: "PROCESS", label: "Diproses", color: "bg-blue-500/10 text-blue-600" },
    { value: "COMPLETED", label: "Selesai", color: "bg-green-500/10 text-green-600" },
    { value: "CANCELLED", label: "Dibatalkan", color: "bg-red-500/10 text-red-600" },
];

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

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<UserDetail | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modals
    const [showAddService, setShowAddService] = useState(false);
    const [showUploadDoc, setShowUploadDoc] = useState<string | null>(null); // applicationId
    const [showNewService, setShowNewService] = useState(false);

    // Form states
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [appName, setAppName] = useState("");
    const [appEstimate, setAppEstimate] = useState("");
    const [newServiceName, setNewServiceName] = useState("");
    const [newServiceDesc, setNewServiceDesc] = useState("");
    const [newServicePrice, setNewServicePrice] = useState("");
    const [docFile, setDocFile] = useState<File | null>(null);
    const [docName, setDocName] = useState("");
    const [docCategory, setDocCategory] = useState("");
    const [docNote, setDocNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const [userRes, servicesRes] = await Promise.all([
                fetch(`/api/hono/admin/users/${userId}`),
                fetch("/api/hono/admin/services"),
            ]);
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData.user);
            } else {
                setError("User tidak ditemukan");
            }
            if (servicesRes.ok) {
                const servicesData = await servicesRes.json();
                setServices(servicesData.services || []);
            }
        } catch {
            setError("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddApplication = async () => {
        if (!selectedServiceId) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/hono/admin/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    serviceId: selectedServiceId,
                    name: appName,
                    estimate: appEstimate || null,
                }),
            });
            if (res.ok) {
                setActionMessage("Layanan berhasil ditambahkan!");
                setShowAddService(false);
                setSelectedServiceId("");
                setAppName("");
                setAppEstimate("");
                fetchData();
            } else {
                const data = await res.json();
                setActionMessage(data.error || "Gagal menambahkan layanan");
            }
        } catch {
            setActionMessage("Terjadi kesalahan");
        } finally {
            setSubmitting(false);
            setTimeout(() => setActionMessage(""), 3000);
        }
    };

    const handleStatusChange = async (appId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/hono/admin/applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchData();
                setActionMessage("Status berhasil diperbarui!");
            }
        } catch {
            setActionMessage("Gagal memperbarui status");
        }
        setTimeout(() => setActionMessage(""), 3000);
    };

    const handleUploadDoc = async () => {
        if (!docFile || !showUploadDoc) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("file", docFile);
            formData.append("name", docName || docFile.name);
            formData.append("category", docCategory);
            formData.append("adminNote", docNote);

            const res = await fetch(`/api/hono/admin/applications/${showUploadDoc}/documents`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                setActionMessage("Dokumen berhasil diunggah!");
                setShowUploadDoc(null);
                setDocFile(null);
                setDocName("");
                setDocCategory("");
                setDocNote("");
                fetchData();
            } else {
                const data = await res.json();
                setActionMessage(data.error || "Gagal mengunggah dokumen");
            }
        } catch {
            setActionMessage("Terjadi kesalahan saat upload");
        } finally {
            setSubmitting(false);
            setTimeout(() => setActionMessage(""), 3000);
        }
    };

    const handleDeleteDoc = async (appId: string, docId: string) => {
        if (!confirm("Hapus dokumen ini?")) return;
        try {
            const res = await fetch(`/api/hono/admin/applications/${appId}/documents/${docId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setActionMessage("Dokumen berhasil dihapus!");
                fetchData();
            }
        } catch {
            setActionMessage("Gagal menghapus dokumen");
        }
        setTimeout(() => setActionMessage(""), 3000);
    };

    const handleCreateService = async () => {
        if (!newServiceName) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/hono/admin/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newServiceName,
                    description: newServiceDesc || null,
                    price: parseFloat(newServicePrice) || 0,
                }),
            });
            if (res.ok) {
                setActionMessage("Layanan baru berhasil dibuat!");
                setShowNewService(false);
                setNewServiceName("");
                setNewServiceDesc("");
                setNewServicePrice("");
                fetchData();
            }
        } catch {
            setActionMessage("Gagal membuat layanan");
        } finally {
            setSubmitting(false);
            setTimeout(() => setActionMessage(""), 3000);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin h-8 w-8 border-4 border-[#2a6ba7] border-t-transparent rounded-full"></div>
        </div>
    );

    if (error || !user) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">error</span>
                <p className="text-lg text-slate-600 mb-4">{error || "User tidak ditemukan"}</p>
                <button onClick={() => router.back()} className="text-[#2a6ba7] font-bold hover:underline">← Kembali</button>
            </div>
        </div>
    );

    const storagePercent = Math.round((user.storageUsed / user.storageLimit) * 100);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Action Message Toast */}
            {actionMessage && (
                <div className="fixed top-6 right-6 z-50 bg-[#2a6ba7] text-white px-6 py-3 rounded-xl shadow-xl font-bold animate-[fadeIn_0.3s_ease]">
                    {actionMessage}
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                        <Link href="/super-admin" className="hover:text-[#2a6ba7] transition-colors">Super Admin</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-slate-800 font-bold">{user.name}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#2a6ba7] to-[#1e5a8a] flex items-center justify-center text-white text-2xl font-black">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
                                <p className="text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddService(true)}
                                className="h-11 px-5 bg-[#2a6ba7] text-white rounded-xl flex items-center gap-2 font-bold text-sm hover:shadow-lg hover:shadow-[#2a6ba7]/20 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Tambah Layanan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
                        <p className="text-lg font-black">{user.role}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Telepon</p>
                        <p className="text-lg font-black">{user.telepon || "-"}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Layanan</p>
                        <p className="text-lg font-black">{user.applications.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Penyimpanan</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-lg font-black">{formatBytes(user.storageUsed)}</p>
                            <p className="text-xs text-slate-400">/ {formatBytes(user.storageLimit)}</p>
                        </div>
                        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${storagePercent > 80 ? "bg-red-500" : "bg-[#2a6ba7]"}`}
                                style={{ width: `${Math.min(storagePercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Applications */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black">Layanan & Dokumen</h2>
                        <button
                            onClick={() => setShowNewService(true)}
                            className="text-sm text-[#2a6ba7] font-bold hover:underline flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">add_circle</span>
                            Buat Layanan Baru
                        </button>
                    </div>

                    {user.applications.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">folder_off</span>
                            <p className="text-slate-500 font-bold mb-2">Belum ada layanan</p>
                            <p className="text-sm text-slate-400">Klik &quot;Tambah Layanan&quot; untuk menambahkan layanan ke user ini.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            {/* Desktop Table */}
                            <table className="w-full text-left hidden md:table">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-6 py-4 w-14">No</th>
                                        <th className="px-6 py-4">Jenis Layanan</th>
                                        <th className="px-6 py-4">Tanggal Pengajuan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {user.applications.map((app, index) => {
                                        const statusOpt = STATUS_OPTIONS.find(s => s.value === app.status);
                                        return (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-bold text-slate-400">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-[#2a6ba7]/10 flex items-center justify-center flex-shrink-0">
                                                            <span className="material-symbols-outlined text-[#2a6ba7]">business</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm truncate">{app.name || app.service.name}</p>
                                                            <p className="text-xs text-slate-400 truncate">{app.service.name} • {app.documents.length} dokumen</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                                    {formatDate(app.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 cursor-pointer ${statusOpt?.color || ""}`}
                                                    >
                                                        {STATUS_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setShowUploadDoc(app.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2a6ba7]/10 text-[#2a6ba7] text-xs font-bold hover:bg-[#2a6ba7]/20 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">upload_file</span>
                                                            Upload
                                                        </button>
                                                        <Link
                                                            href={`/super-admin/applications/${app.id}`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">settings</span>
                                                            Kelola
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Mobile List */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {user.applications.map((app, index) => {
                                    const statusOpt = STATUS_OPTIONS.find(s => s.value === app.status);
                                    return (
                                        <div key={app.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-xs font-bold text-slate-400 mt-1 w-5 flex-shrink-0">{index + 1}</span>
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="h-10 w-10 rounded-xl bg-[#2a6ba7]/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="material-symbols-outlined text-[#2a6ba7]">business</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate">{app.name || app.service.name}</p>
                                                        <p className="text-xs text-slate-400">{app.service.name} • {formatDate(app.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between ml-8">
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                    className={`px-2 py-1 rounded-lg text-xs font-bold border-0 cursor-pointer ${statusOpt?.color || ""}`}
                                                >
                                                    {STATUS_OPTIONS.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => setShowUploadDoc(app.id)}
                                                        className="h-8 w-8 rounded-lg bg-[#2a6ba7]/10 flex items-center justify-center text-[#2a6ba7]"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                                    </button>
                                                    <Link
                                                        href={`/super-admin/applications/${app.id}`}
                                                        className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">settings</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Service Modal */}
            {showAddService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAddService(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-black mb-4">Tambah Layanan untuk {user.name}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Pilih Layanan</label>
                                <select
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                >
                                    <option value="">-- Pilih Layanan --</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Nama Bisnis / Judul</label>
                                <input
                                    type="text"
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    placeholder="contoh: PT Maju Bersama"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Estimasi Selesai</label>
                                <input
                                    type="text"
                                    value={appEstimate}
                                    onChange={(e) => setAppEstimate(e.target.value)}
                                    placeholder="contoh: 24 Jan 2024"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowAddService(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={handleAddApplication}
                                disabled={submitting || !selectedServiceId}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#2a6ba7] hover:bg-[#1e5a8a] transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Menyimpan..." : "Tambah"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Document Modal */}
            {showUploadDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadDoc(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-black mb-4">Upload Dokumen</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">File</label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#2a6ba7]/10 file:text-[#2a6ba7] hover:file:bg-[#2a6ba7]/20"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Nama Dokumen</label>
                                <input
                                    type="text"
                                    value={docName}
                                    onChange={(e) => setDocName(e.target.value)}
                                    placeholder="Opsional, default: nama file"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Kategori</label>
                                <select
                                    value={docCategory}
                                    onChange={(e) => setDocCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                >
                                    <option value="">Umum</option>
                                    <option value="Legalitas">Legalitas</option>
                                    <option value="Perpajakan">Perpajakan</option>
                                    <option value="Perizinan">Perizinan</option>
                                    <option value="Sertifikat">Sertifikat</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Catatan Admin</label>
                                <input
                                    type="text"
                                    value={docNote}
                                    onChange={(e) => setDocNote(e.target.value)}
                                    placeholder="Catatan opsional"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowUploadDoc(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={handleUploadDoc}
                                disabled={submitting || !docFile}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#2a6ba7] hover:bg-[#1e5a8a] transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Mengunggah..." : "Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Service Modal */}
            {showNewService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowNewService(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-black mb-4">Buat Layanan Baru</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Nama Layanan</label>
                                <input
                                    type="text"
                                    value={newServiceName}
                                    onChange={(e) => setNewServiceName(e.target.value)}
                                    placeholder="contoh: Pendirian PT Perorangan"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Deskripsi</label>
                                <input
                                    type="text"
                                    value={newServiceDesc}
                                    onChange={(e) => setNewServiceDesc(e.target.value)}
                                    placeholder="Deskripsi singkat"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 mb-1 block">Harga (Rp)</label>
                                <input
                                    type="number"
                                    value={newServicePrice}
                                    onChange={(e) => setNewServicePrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-[#2a6ba7]/20 focus:border-[#2a6ba7] outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowNewService(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={handleCreateService}
                                disabled={submitting || !newServiceName}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#2a6ba7] hover:bg-[#1e5a8a] transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Menyimpan..." : "Buat Layanan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
