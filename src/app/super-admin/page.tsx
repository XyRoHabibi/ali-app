import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperAdminDashboard() {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    const [totalUsers, adminCount, recentUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "SUPER_ADMIN" } }),
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        }),
    ]);

    const regularUsers = totalUsers - adminCount;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-white mb-1">
                    Dashboard Admin
                </h1>
                <p className="text-slate-400 text-sm">
                    Selamat datang, {session.user.name}. Berikut ringkasan sistem.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-indigo-400 text-2xl">
                                group
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white">
                                {totalUsers}
                            </p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Total User
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-400 text-2xl">
                                shield_person
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white">
                                {adminCount}
                            </p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Admin
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-400 text-2xl">
                                person
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white">
                                {regularUsers}
                            </p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                User Biasa
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#334155] flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-white">
                            User Terbaru
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            5 pendaftaran terakhir
                        </p>
                    </div>
                    <a
                        href="/super-admin/users"
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Lihat Semua →
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#334155]">
                                <th className="text-left px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Nama
                                </th>
                                <th className="text-left px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Email
                                </th>
                                <th className="text-left px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Role
                                </th>
                                <th className="text-left px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Tanggal Daftar
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-[#334155]/50 hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                {user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </div>
                                            <span className="text-sm font-bold text-white">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {user.email}
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
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
