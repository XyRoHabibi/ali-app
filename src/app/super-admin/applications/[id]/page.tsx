"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Types matching Prisma Schema & API Response
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

interface ApplicationDoc {
    id: string;
    name: string;
    fileUrl: string;
    fileSize: number;
    fileType: string | null;
    category: string | null;
    adminNote: string | null;
    documentNumber: string | null;
    createdAt: string;
}

interface ApplicationDetail {
    id: string;
    name: string;
    status: string;
    estimate: string | null;
    createdAt: string;
    service: { id: string; name: string };
    user: { name: string; email: string };
    documents: ApplicationDoc[];
    companyData: CompanyData | null;
}

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
    });
}

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const appId = params.id as string;

    const [app, setApp] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Edit States
    const [editCompanyData, setEditCompanyData] = useState(false);
    const [formData, setFormData] = useState({
        emailPerusahaan: "",
        emailPassword: "",
        akunOss: "",
        akunOssPassword: "",
    });

    // Modals
    const [showAddDirector, setShowAddDirector] = useState(false);
    const [newDirector, setNewDirector] = useState({ name: "", jabatan: "Direktur", masaJabatan: "", akhirMenjabat: "" });

    const [showAddAgreement, setShowAddAgreement] = useState(false);
    const [newAgreement, setNewAgreement] = useState({ title: "", validUntil: "", status: "Aktif" });

    const [showAddTax, setShowAddTax] = useState(false);
    const [newTax, setNewTax] = useState({ title: "", description: "", status: "BELUM LAPOR", date: "" });

    // Document upload states
    const [showUploadDoc, setShowUploadDoc] = useState(false);
    const [docFile, setDocFile] = useState<File | null>(null);
    const [docName, setDocName] = useState("");
    const [docCategory, setDocCategory] = useState("");
    const [docNote, setDocNote] = useState("");
    const [docNumber, setDocNumber] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`/api/hono/admin/applications/${appId}`);
            if (res.ok) {
                const data = await res.json();
                setApp(data.application);
                if (data.application.companyData) {
                    setFormData({
                        emailPerusahaan: data.application.companyData.emailPerusahaan || "",
                        emailPassword: data.application.companyData.emailPassword || "",
                        akunOss: data.application.companyData.akunOss || "",
                        akunOssPassword: data.application.companyData.akunOssPassword || "",
                    });
                }
            } else {
                setError("Aplikasi tidak ditemukan");
            }
        } catch {
            setError("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    }, [appId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveCompanyData = async () => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/hono/admin/applications/${appId}/company-data`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const data = await res.json();
                setActionMessage("Data perusahaan disimpan!");
                setEditCompanyData(false);
                fetchData();
                return data.companyData.id as string;
            } else {
                setActionMessage("Gagal menyimpan data");
            }
        } catch {
            setActionMessage("Terjadi kesalahan");
        } finally {
            setSubmitting(false);
            setTimeout(() => setActionMessage(""), 3000);
        }
        return undefined;
    };

    const handleAddDirector = async () => {
        let companyDataId = app?.companyData?.id;
        if (!companyDataId) {
            companyDataId = await handleSaveCompanyData();
            if (!companyDataId) {
                alert("Gagal membuat profil perusahaan, mohon coba lagi.");
                return;
            }
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/hono/admin/company-data/${companyDataId}/directors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDirector),
            });
            if (res.ok) {
                setActionMessage("Direktur berhasil ditambahkan!");
                setShowAddDirector(false);
                setNewDirector({ name: "", jabatan: "Direktur", masaJabatan: "", akhirMenjabat: "" });
                fetchData();
            }
        } catch {
            setActionMessage("Gagal menambah direktur");
        } finally {
            setSubmitting(false);
            setTimeout(() => setActionMessage(""), 3000);
        }
    };

    const handleDeleteDirector = async (id: string) => {
        if (!confirm("Hapus direktur ini?")) return;
        try {
            const res = await fetch(`/api/hono/admin/directors/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch {
            alert("Gagal menghapus");
        }
    };

    const handleAddAgreement = async () => {
        let companyDataId = app?.companyData?.id;
        if (!companyDataId) {
            companyDataId = await handleSaveCompanyData();
            if (!companyDataId) {
                alert("Gagal membuat profil perusahaan, mohon coba lagi.");
                return;
            }
        }
        setSubmitting(true);
        try {
            const res = await fetch(`/api/hono/admin/company-data/${companyDataId}/agreements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAgreement),
            });
            if (res.ok) {
                setActionMessage("Perjanjian berhasil ditambahkan!");
                setShowAddAgreement(false);
                setNewAgreement({ title: "", validUntil: "", status: "Aktif" });
                fetchData();
            }
        } catch {
            setActionMessage("Gagal menambah perjanjian");
        } finally {
            setSubmitting(false);
            setTimeout(() => setActionMessage(""), 3000);
        }
    };

    const handleDeleteAgreement = async (id: string) => {
        if (!confirm("Hapus perjanjian ini?")) return;
        try {
            const res = await fetch(`/api/hono/admin/agreements/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch {
            alert("Gagal menghapus");
        }
    };

    const handleAddTax = async () => {
        let companyDataId = app?.companyData?.id;
        if (!companyDataId) {
            companyDataId = await handleSaveCompanyData();
            if (!companyDataId) {
                alert("Gagal membuat profil perusahaan, mohon coba lagi.");
                return;
            }
        }
        setSubmitting(true);
        try {
            const res = await fetch(`/api/hono/admin/company-data/${companyDataId}/tax-reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTax),
            });
            if (res.ok) {
                setActionMessage("Laporan pajak ditambahkan!");
                setShowAddTax(false);
                setNewTax({ title: "", description: "", status: "BELUM LAPOR", date: "" });
                fetchData();
            }
        } catch {
            setActionMessage("Gagal menambah laporan");
        } finally {
            setSubmitting(false);
            setTimeout(() => setActionMessage(""), 3000);
        }
    };

    const handleDeleteTax = async (id: string) => {
        if (!confirm("Hapus laporan ini?")) return;
        try {
            const res = await fetch(`/api/hono/admin/tax-reports/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch {
            alert("Gagal menghapus");
        }
    };

    const handleUploadDoc = async () => {
        if (!docFile) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("file", docFile);
            formData.append("name", docName || docFile.name);
            formData.append("category", docCategory);
            formData.append("adminNote", docNote);
            formData.append("documentNumber", docNumber);

            const res = await fetch(`/api/hono/admin/applications/${appId}/documents`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                setActionMessage("Dokumen berhasil diunggah!");
                setShowUploadDoc(false);
                setDocFile(null);
                setDocName("");
                setDocCategory("");
                setDocNote("");
                setDocNumber("");
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

    const handleDeleteDoc = async (docId: string) => {
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin h-8 w-8 border-4 border-[#2a6ba7] border-t-transparent rounded-full"></div>
        </div>
    );

    if (error || !app) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <p className="text-lg text-slate-600 mb-4">{error || "Aplikasi tidak ditemukan"}</p>
                <button onClick={() => router.back()} className="text-[#2a6ba7] font-bold">← Kembali</button>
            </div>
        </div>
    );

    const directors = app.companyData?.directors || [];
    const agreements = app.companyData?.agreements || [];
    const taxReports = app.companyData?.taxReports || [];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Toast */}
            {actionMessage && (
                <div className="fixed top-6 right-6 z-50 bg-[#2a6ba7] text-white px-6 py-3 rounded-xl shadow-xl font-bold animate-[fadeIn_0.3s_ease]">
                    {actionMessage}
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                        <span onClick={() => router.back()} className="cursor-pointer hover:text-[#2a6ba7] transition-colors">Kembali</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-slate-800 font-bold">Kelola Detail Aplikasi</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-black">{app.name || app.service.name}</h1>
                            <p className="text-slate-500">Milik: {app.user.name} ({app.user.email})</p>
                        </div>
                        <div className="bg-blue-50 text-[#2a6ba7] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {app.status}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* Documents Table Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Berkas Dokumen</h2>
                        <button
                            onClick={() => setShowUploadDoc(true)}
                            className="text-sm font-bold text-[#2a6ba7] flex items-center gap-1 hover:underline"
                        >
                            <span className="material-symbols-outlined text-base">upload_file</span> Upload Dokumen
                        </button>
                    </div>

                    {app.documents.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-slate-400">
                            Belum ada dokumen diupload untuk layanan ini.
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200">
                            {/* Mobile Card List */}
                            <div className="lg:hidden divide-y divide-slate-100">
                                {app.documents.map((doc, index) => (
                                    <div key={doc.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xs font-bold text-slate-400 mt-2.5 w-5 flex-shrink-0 text-center">{index + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{doc.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{doc.category || "Umum"} • {formatBytes(doc.fileSize)}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full">Valid</span>
                                                    {doc.documentNumber && (
                                                        <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">No: {doc.documentNumber}</span>
                                                    )}
                                                    <span className="text-[10px] text-slate-400">{formatDate(doc.createdAt)}</span>
                                                </div>
                                                <div className="flex gap-1.5 mt-2.5">
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2a6ba7]/10 text-[#2a6ba7] text-xs font-bold hover:bg-[#2a6ba7] hover:text-white transition-all">
                                                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                                                        Lihat
                                                    </a>
                                                    <a href={doc.fileUrl} download className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-all">
                                                        <span className="material-symbols-outlined text-[14px]">download</span>
                                                        Unduh
                                                    </a>
                                                    <button onClick={() => handleDeleteDoc(doc.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-all">
                                                        <span className="material-symbols-outlined text-[14px]">delete</span>
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-4 py-3 w-12">No</th>
                                            <th className="px-4 py-3 min-w-[200px]">Jenis Dokumen</th>
                                            <th className="px-4 py-3 w-24">Status</th>
                                            <th className="px-4 py-3 min-w-[120px]">No Dokumen</th>
                                            <th className="px-4 py-3 whitespace-nowrap w-36">Tanggal Dokumen</th>
                                            <th className="px-4 py-3 w-32">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {app.documents.map((doc, index) => (
                                            <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-bold text-slate-400">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate max-w-[220px]">{doc.name}</p>
                                                        <p className="text-xs text-slate-400 truncate">{doc.category || "Umum"} • {formatBytes(doc.fileSize)}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 whitespace-nowrap">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1" />
                                                        Valid
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600 font-mono whitespace-nowrap">{doc.documentNumber || "-"}</td>
                                                <td className="px-4 py-3 text-sm text-slate-500 font-medium whitespace-nowrap">{formatDate(doc.createdAt)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <a
                                                            href={doc.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Lihat Dokumen"
                                                            className="h-8 w-8 rounded-lg bg-[#2a6ba7]/10 flex items-center justify-center text-[#2a6ba7] hover:bg-[#2a6ba7] hover:text-white transition-all flex-shrink-0"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                        </a>
                                                        <a
                                                            href={doc.fileUrl}
                                                            download
                                                            title="Unduh Dokumen"
                                                            className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all flex-shrink-0"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">download</span>
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteDoc(doc.id)}
                                                            title="Hapus Dokumen"
                                                            className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all flex-shrink-0"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Directors Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Direksi & Komisaris</h2>
                        <button
                            onClick={() => setShowAddDirector(true)}
                            className="text-sm font-bold text-[#2a6ba7] flex items-center gap-1 hover:underline"
                        >
                            <span className="material-symbols-outlined text-base">add</span> Tambah
                        </button>
                    </div>

                    {directors.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-slate-400">
                            Belum ada data direksi/komisaris.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {directors.map((member) => (
                                <div key={member.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative group">
                                    <button
                                        onClick={() => handleDeleteDirector(member.id)}
                                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 text-[#2a6ba7] flex items-center justify-center font-bold text-lg">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{member.name}</h3>
                                            <p className="text-sm text-slate-500">{member.jabatan}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Masa Jabatan</span>
                                            <span className="font-medium">{member.masaJabatan || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Berakhir</span>
                                            <span className="font-medium">{formatDate(member.akhirMenjabat)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Status</span>
                                            <span className={`font-bold ${member.status === 'Aktif' ? 'text-emerald-500' : 'text-slate-500'}`}>{member.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Col: Agreements & Tax */}
                    <div className="xl:col-span-2 space-y-8">

                        {/* Agreements */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h2 className="font-bold text-lg">Daftar Perjanjian</h2>
                                <button
                                    onClick={() => setShowAddAgreement(true)}
                                    className="text-[#2a6ba7] text-sm font-bold hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-base">add</span> Tambah
                                </button>
                            </div>
                            {agreements.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">Belum ada perjanjian dicatat.</div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="text-slate-500 font-medium border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">Judul</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Exp</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {agreements.map((ag) => (
                                            <tr key={ag.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium">{ag.title}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${ag.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {ag.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{formatDate(ag.validUntil)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleDeleteAgreement(ag.id)} className="text-slate-300 hover:text-red-500">
                                                        <span className="material-symbols-outlined text-base">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Tax Reports timeline */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-lg">Perizinan & Pajak Bulanan</h2>
                                <button
                                    onClick={() => setShowAddTax(true)}
                                    className="text-[#2a6ba7] text-sm font-bold hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-base">add</span> Update
                                </button>
                            </div>

                            {taxReports.length === 0 ? (
                                <div className="text-center text-slate-400 text-sm">Belum ada history pajak/perizinan.</div>
                            ) : (
                                <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                                    {taxReports.map((item) => (
                                        <div key={item.id} className="relative group">
                                            <button
                                                onClick={() => handleDeleteTax(item.id)}
                                                className="absolute -right-2 top-0 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                            <div className={`absolute -left-[21px] top-1 bg-white border-2 ${item.status === 'SELESAI' ? 'border-emerald-500' : 'border-orange-500'} w-3 h-3 rounded-full`}></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                <div>
                                                    <div className={`text-xs font-bold mb-1 ${item.status === 'SELESAI' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                                        {item.status}
                                                    </div>
                                                    <h4 className="font-medium">{item.title}</h4>
                                                    <p className="text-xs text-slate-500">{item.description}</p>
                                                </div>
                                                <div className="mt-1 sm:mt-0 text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                                                    {formatDate(item.date)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Data Penting */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">lock</span>
                                    Data Penting
                                </h2>
                                {!editCompanyData ? (
                                    <button onClick={() => setEditCompanyData(true)} className="text-xs font-bold text-[#2a6ba7] hover:underline">Edit</button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditCompanyData(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Batal</button>
                                        <button onClick={handleSaveCompanyData} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Simpan</button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Email */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-[#2a6ba7] text-sm">email</span>
                                        <span className="text-xs font-bold text-slate-500">Email Perusahaan</span>
                                    </div>
                                    {editCompanyData ? (
                                        <div className="space-y-2">
                                            <input
                                                value={formData.emailPerusahaan}
                                                onChange={e => setFormData({ ...formData, emailPerusahaan: e.target.value })}
                                                className="w-full text-sm p-2 rounded border" placeholder="Email"
                                            />
                                            <input
                                                value={formData.emailPassword}
                                                onChange={e => setFormData({ ...formData, emailPassword: e.target.value })}
                                                className="w-full text-sm p-2 rounded border" placeholder="Password Email"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-mono text-sm truncate mb-1">{app.companyData?.emailPerusahaan || "-"}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-400">Password:</span>
                                                <span className="font-mono text-xs text-slate-600">{app.companyData?.emailPassword || "-"}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* OSS */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-purple-500 text-sm">vpn_key</span>
                                        <span className="text-xs font-bold text-slate-500">Akun OSS / Perizinan</span>
                                    </div>
                                    {editCompanyData ? (
                                        <div className="space-y-2">
                                            <input
                                                value={formData.akunOss}
                                                onChange={e => setFormData({ ...formData, akunOss: e.target.value })}
                                                className="w-full text-sm p-2 rounded border" placeholder="Username OSS"
                                            />
                                            <input
                                                value={formData.akunOssPassword}
                                                onChange={e => setFormData({ ...formData, akunOssPassword: e.target.value })}
                                                className="w-full text-sm p-2 rounded border" placeholder="Password OSS"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-mono text-sm truncate mb-1">{app.companyData?.akunOss || "-"}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-400">Password:</span>
                                                <span className="font-mono text-xs text-slate-600">{app.companyData?.akunOssPassword || "-"}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modals */}
            {showAddDirector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddDirector(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">Tambah Direksi/Komisaris</h3>
                        <div className="space-y-3">
                            <input placeholder="Nama Lengkap" className="w-full p-2 border rounded" value={newDirector.name} onChange={e => setNewDirector({ ...newDirector, name: e.target.value })} />
                            <select className="w-full p-2 border rounded" value={newDirector.jabatan} onChange={e => setNewDirector({ ...newDirector, jabatan: e.target.value })}>
                                <option>Direktur Utama</option>
                                <option>Direktur</option>
                                <option>Komisaris Utama</option>
                                <option>Komisaris</option>
                            </select>
                            <input placeholder="Masa Jabatan (misal: 5 Tahun)" className="w-full p-2 border rounded" value={newDirector.masaJabatan} onChange={e => setNewDirector({ ...newDirector, masaJabatan: e.target.value })} />
                            <input type="date" className="w-full p-2 border rounded" value={newDirector.akhirMenjabat} onChange={e => setNewDirector({ ...newDirector, akhirMenjabat: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleAddDirector} disabled={!newDirector.name} className="bg-[#2a6ba7] text-white px-4 py-2 rounded font-bold text-sm">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddAgreement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddAgreement(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">Tambah Perjanjian</h3>
                        <div className="space-y-3">
                            <input placeholder="Judul Perjanjian" className="w-full p-2 border rounded" value={newAgreement.title} onChange={e => setNewAgreement({ ...newAgreement, title: e.target.value })} />
                            <input type="date" className="w-full p-2 border rounded" value={newAgreement.validUntil} onChange={e => setNewAgreement({ ...newAgreement, validUntil: e.target.value })} />
                            <select className="w-full p-2 border rounded" value={newAgreement.status} onChange={e => setNewAgreement({ ...newAgreement, status: e.target.value })}>
                                <option value="Aktif">Aktif</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleAddAgreement} disabled={!newAgreement.title} className="bg-[#2a6ba7] text-white px-4 py-2 rounded font-bold text-sm">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddTax && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddTax(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">Update Pajak/Perizinan</h3>
                        <div className="space-y-3">
                            <input placeholder="Judul (misal: Pajak Mei)" className="w-full p-2 border rounded" value={newTax.title} onChange={e => setNewTax({ ...newTax, title: e.target.value })} />
                            <input placeholder="Keterangan" className="w-full p-2 border rounded" value={newTax.description} onChange={e => setNewTax({ ...newTax, description: e.target.value })} />
                            <select className="w-full p-2 border rounded" value={newTax.status} onChange={e => setNewTax({ ...newTax, status: e.target.value })}>
                                <option value="BELUM LAPOR">BELUM LAPOR</option>
                                <option value="SELESAI">SELESAI</option>
                            </select>
                            <input type="date" className="w-full p-2 border rounded" value={newTax.date} onChange={e => setNewTax({ ...newTax, date: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleAddTax} disabled={!newTax.title} className="bg-[#2a6ba7] text-white px-4 py-2 rounded font-bold text-sm">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Document Modal */}
            {showUploadDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadDoc(false)}>
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
                                <label className="text-sm font-bold text-slate-600 mb-1 block">No Dokumen</label>
                                <input
                                    type="text"
                                    value={docNumber}
                                    onChange={(e) => setDocNumber(e.target.value)}
                                    placeholder="contoh: 1234567890"
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
                            <button onClick={() => setShowUploadDoc(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
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
        </div>
    );
}
