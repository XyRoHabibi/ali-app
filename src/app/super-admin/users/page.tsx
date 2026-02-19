"use client";

import { useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    alamat: string | null;
    telepon: string | null;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/hono/admin/users");
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId: string, userName: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus user "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        setDeleting(userId);
        try {
            const res = await fetch(`/api/hono/admin/users/${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers(users.filter((u) => u.id !== userId));
            } else {
                const data = await res.json();
                alert(data.error || "Gagal menghapus user");
            }
        } catch {
            alert("Terjadi kesalahan saat menghapus user");
        } finally {
            setDeleting(null);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 font-bold">
                        Memuat data user...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-white mb-1">
                        Kelola User
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {users.length} user terdaftar
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-xl select-none pointer-events-none">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-12 pr-4 bg-[#1e293b] border border-[#334155] rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#334155]">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    User
                                </th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">
                                    Email
                                </th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">
                                    Telepon
                                </th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Role
                                </th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:table-cell">
                                    Terdaftar
                                </th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <span className="material-symbols-outlined text-4xl mb-2 block">
                                            person_off
                                        </span>
                                        <p className="font-bold">
                                            {searchQuery
                                                ? "Tidak ada user yang cocok"
                                                : "Belum ada user"}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-[#334155]/50 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`size-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.role ===
                                                            "SUPER_ADMIN"
                                                            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                                                            : "bg-gradient-to-br from-slate-500 to-slate-600"
                                                        }`}
                                                >
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()
                                                        .slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 md:hidden">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 hidden md:table-cell">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 hidden lg:table-cell">
                                            {user.telepon || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role === "SUPER_ADMIN"
                                                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                                    }`}
                                            >
                                                {user.role === "SUPER_ADMIN"
                                                    ? "Admin"
                                                    : "User"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== "SUPER_ADMIN" ? (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id,
                                                            user.name
                                                        )
                                                    }
                                                    disabled={
                                                        deleting === user.id
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deleting === user.id ? (
                                                        <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-base">
                                                            delete
                                                        </span>
                                                    )}
                                                    Hapus
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-600 font-bold">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
