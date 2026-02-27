"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
}

interface Reminder {
    id: string;
    userId: string;
    title: string;
    type: string;
    dueDate: string;
    icon: string;
    createdAt: string;
    user: User;
}

const REMINDER_TYPES = [
    { value: "pajak", label: "Pajak", icon: "receipt_long" },
    { value: "task", label: "Task", icon: "assignment" },
    { value: "jabatan", label: "Jabatan", icon: "badge" },
    { value: "dokumen", label: "Dokumen", icon: "description" },
];

const ICON_OPTIONS = [
    { value: "warning", label: "Warning" },
    { value: "assignment", label: "Assignment" },
    { value: "badge", label: "Badge" },
    { value: "schedule", label: "Schedule" },
    { value: "verified_user", label: "Verified" },
    { value: "check_circle", label: "Check Circle" },
    { value: "receipt_long", label: "Receipt" },
    { value: "description", label: "Document" },
    { value: "notifications", label: "Notification" },
    { value: "event", label: "Event" },
    { value: "gavel", label: "Legal" },
    { value: "account_balance", label: "Bank" },
    { value: "edit_document", label: "Edit Doc" },
];

export default function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const [filterUser, setFilterUser] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formUserId, setFormUserId] = useState("");
    const [formTitle, setFormTitle] = useState("");
    const [formType, setFormType] = useState("task");
    const [formDueDate, setFormDueDate] = useState("");
    const [formIcon, setFormIcon] = useState("notifications");

    const fetchReminders = useCallback(async () => {
        try {
            const url = filterUser
                ? `/api/hono/admin/reminders?userId=${filterUser}`
                : "/api/hono/admin/reminders";
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setReminders(data.reminders || []);
            }
        } catch (err) {
            console.error("Failed to fetch reminders:", err);
        } finally {
            setLoading(false);
        }
    }, [filterUser]);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/hono/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers((data.users || []).filter((u: User & { role: string }) => u.role === "USER"));
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const resetForm = () => {
        setFormUserId("");
        setFormTitle("");
        setFormType("task");
        setFormDueDate("");
        setFormIcon("notifications");
        setEditingReminder(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (reminder: Reminder) => {
        setEditingReminder(reminder);
        setFormUserId(reminder.userId);
        setFormTitle(reminder.title);
        setFormType(reminder.type);
        setFormDueDate(new Date(reminder.dueDate).toISOString().split("T")[0]);
        setFormIcon(reminder.icon);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formUserId || !formTitle || !formDueDate) return;
        setSubmitting(true);

        try {
            if (editingReminder) {
                // Update
                const res = await fetch(`/api/hono/admin/reminders/${editingReminder.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: formTitle,
                        type: formType,
                        dueDate: formDueDate,
                        icon: formIcon,
                    }),
                });
                if (!res.ok) throw new Error("Failed to update");
            } else {
                // Create
                const res = await fetch("/api/hono/admin/reminders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: formUserId,
                        title: formTitle,
                        type: formType,
                        dueDate: formDueDate,
                        icon: formIcon,
                    }),
                });
                if (!res.ok) throw new Error("Failed to create");
            }

            setShowModal(false);
            resetForm();
            fetchReminders();
        } catch (err) {
            console.error("Submit error:", err);
            alert("Terjadi kesalahan!");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pengingat ini?")) return;

        try {
            const res = await fetch(`/api/hono/admin/reminders/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchReminders();
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const getRemainingDays = (dueDate: string) => {
        const diffMs = new Date(dueDate).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    };

    const getStatusColor = (dueDate: string) => {
        const remaining = getRemainingDays(dueDate);
        if (remaining <= 5) return "red";
        if (remaining <= 30) return "amber";
        return "emerald";
    };

    const getTypeLabel = (type: string) => {
        return REMINDER_TYPES.find((t) => t.value === type)?.label || type;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/super-admin"
                            className="size-10 rounded-xl bg-[#334155] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#475569] transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">
                                Kelola Pengingat
                            </h1>
                            <p className="text-slate-400 text-sm font-bold">
                                Atur pengingat untuk setiap pengguna
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold gap-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Tambah Pengingat
                </button>
            </div>

            {/* Filter by User */}
            <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        <span className="text-sm font-bold">Filter User:</span>
                    </div>
                    <select
                        value={filterUser}
                        onChange={(e) => {
                            setFilterUser(e.target.value);
                            setLoading(true);
                        }}
                        className="h-10 px-4 bg-[#0f172a] border border-[#334155] rounded-xl text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none min-w-[240px]"
                    >
                        <option value="">Semua User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                    <div className="ml-auto text-sm font-bold text-slate-500">
                        {reminders.length} pengingat
                    </div>
                </div>
            </div>

            {/* Reminders Table */}
            <div className="bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="h-10 w-10 bg-[#334155] rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-[#334155] rounded w-64" />
                                    <div className="h-3 bg-[#334155] rounded w-40" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : reminders.length === 0 ? (
                    <div className="p-16 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-600 mb-4 block">
                            notifications_off
                        </span>
                        <p className="text-slate-400 font-bold mb-1">Belum ada pengingat</p>
                        <p className="text-sm text-slate-500">
                            Klik &quot;Tambah Pengingat&quot; untuk membuat pengingat baru.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card Layout */}
                        <div className="md:hidden divide-y divide-[#334155]">
                            {reminders.map((reminder) => {
                                const remaining = getRemainingDays(reminder.dueDate);
                                const statusColor = getStatusColor(reminder.dueDate);
                                return (
                                    <div key={reminder.id} className="p-4 hover:bg-[#334155]/30 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusColor === "red" ? "bg-red-500/10 text-red-400"
                                                    : statusColor === "amber" ? "bg-amber-500/10 text-amber-400"
                                                        : "bg-emerald-500/10 text-emerald-400"
                                                }`}>
                                                <span className="material-symbols-outlined">{reminder.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-white truncate">{reminder.title}</p>
                                                <p className="text-xs text-slate-400 truncate">
                                                    {reminder.user.name} • {getTypeLabel(reminder.type)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between ml-[52px]">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 text-[10px] font-black rounded-md ${statusColor === "red" ? "bg-red-500/10 text-red-400"
                                                        : statusColor === "amber" ? "bg-amber-500/10 text-amber-400"
                                                            : "bg-emerald-500/10 text-emerald-400"
                                                    }`}>
                                                    {remaining} hari
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(reminder.dueDate).toLocaleDateString("id-ID")}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => openEditModal(reminder)}
                                                    className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reminder.id)}
                                                    className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table Layout */}
                        <table className="w-full text-left hidden md:table">
                            <thead className="bg-[#0f172a]/50 border-b border-[#334155]">
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-4">Pengingat</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Tipe</th>
                                    <th className="px-6 py-4">Batas Waktu</th>
                                    <th className="px-6 py-4">Sisa</th>
                                    <th className="px-6 py-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#334155]/50">
                                {reminders.map((reminder) => {
                                    const remaining = getRemainingDays(reminder.dueDate);
                                    const statusColor = getStatusColor(reminder.dueDate);
                                    return (
                                        <tr key={reminder.id} className="hover:bg-[#334155]/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusColor === "red" ? "bg-red-500/10 text-red-400"
                                                            : statusColor === "amber" ? "bg-amber-500/10 text-amber-400"
                                                                : "bg-emerald-500/10 text-emerald-400"
                                                        }`}>
                                                        <span className="material-symbols-outlined">{reminder.icon}</span>
                                                    </div>
                                                    <p className="font-bold text-sm text-white truncate max-w-[220px]">
                                                        {reminder.title}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-white truncate">{reminder.user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{reminder.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                    {getTypeLabel(reminder.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                                                {new Date(reminder.dueDate).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${statusColor === "red" ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                        : statusColor === "amber" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    }`}>
                                                    {remaining} hari
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(reminder)}
                                                        className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 hover:scale-110 transition-all"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(reminder.id)}
                                                        className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all"
                                                        title="Hapus"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] rounded-2xl border border-[#334155] w-full max-w-lg shadow-2xl">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-[#334155] flex items-center justify-between">
                            <h2 className="text-lg font-black text-white">
                                {editingReminder ? "Edit Pengingat" : "Tambah Pengingat Baru"}
                            </h2>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="size-8 rounded-lg bg-[#334155] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-5">
                            {/* User Select */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    User
                                </label>
                                <select
                                    value={formUserId}
                                    onChange={(e) => setFormUserId(e.target.value)}
                                    disabled={!!editingReminder}
                                    className="w-full h-11 px-4 bg-[#0f172a] border border-[#334155] rounded-xl text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none disabled:opacity-50"
                                >
                                    <option value="">Pilih User</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Judul Pengingat
                                </label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    placeholder="Contoh: SPT Masa PPh Pasal 21"
                                    className="w-full h-11 px-4 bg-[#0f172a] border border-[#334155] rounded-xl text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none placeholder:text-slate-600"
                                />
                            </div>

                            {/* Type & Icon Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Tipe
                                    </label>
                                    <select
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value)}
                                        className="w-full h-11 px-4 bg-[#0f172a] border border-[#334155] rounded-xl text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
                                    >
                                        {REMINDER_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Icon
                                    </label>
                                    <select
                                        value={formIcon}
                                        onChange={(e) => setFormIcon(e.target.value)}
                                        className="w-full h-11 px-4 bg-[#0f172a] border border-[#334155] rounded-xl text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
                                    >
                                        {ICON_OPTIONS.map((icon) => (
                                            <option key={icon.value} value={icon.value}>
                                                {icon.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Icon Preview */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-[#0f172a] rounded-xl border border-[#334155]">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                    <span className="material-symbols-outlined">{formIcon}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Preview Icon</p>
                                    <p className="text-sm font-bold text-white">{formIcon}</p>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Batas Waktu
                                </label>
                                <input
                                    type="date"
                                    value={formDueDate}
                                    onChange={(e) => setFormDueDate(e.target.value)}
                                    className="w-full h-11 px-4 bg-[#0f172a] border border-[#334155] rounded-xl text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-[#334155] flex items-center justify-end gap-3">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="h-10 px-5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formUserId || !formTitle || !formDueDate || submitting}
                                className="h-10 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[16px]">
                                            {editingReminder ? "save" : "add"}
                                        </span>
                                        {editingReminder ? "Simpan Perubahan" : "Tambah Pengingat"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
