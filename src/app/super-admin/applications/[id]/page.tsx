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
        </div>
    );
}
