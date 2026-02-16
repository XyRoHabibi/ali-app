"use client";

import Link from "next/link";
import Image from "next/image";

export default function PermohonanDetailPage() {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs (Optional but premium) */}
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <Link href="/dashboard" className="hover:text-[#2a6ba7] transition-colors">Dashboard</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-[#2a6ba7]">Detail Pengajuan PT</span>
            </div>

            {/* Status Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Status Pengajuan Pendirian PT</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-sm font-bold">ID Pengajuan: #AL-99283</span>
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5">
                            <span className="size-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                            Menunggu Review Admin
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="h-11 px-5 bg-white border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">print</span>
                        Cetak Ringkasan
                    </button>
                    <button className="h-11 px-5 bg-[#2a6ba7] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2a6ba7]/20 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Ubah Data
                    </button>
                </div>
            </div>

            {/* Alert Notice Section */}
            <div className="mb-10 bg-[#2a6ba7]/5 border border-[#2a6ba7]/10 rounded-2xl p-6 flex items-start gap-4">
                <div className="bg-[#2a6ba7] text-white p-2.5 rounded-xl shadow-lg shadow-[#2a6ba7]/20">
                    <span className="material-symbols-outlined text-xl">info</span>
                </div>
                <div>
                    <p className="text-[#2a6ba7] font-black text-sm uppercase tracking-wider">Proses Review Sedang Berlangsung</p>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed font-medium">
                        Tim legal kami sedang meninjau dokumen Anda. Estimasi waktu review adalah <span className="font-black text-slate-900">24 jam kerja</span>. Anda akan menerima notifikasi via email setelah verifikasi selesai.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Main Information */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Company Data Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg">Detail Perusahaan</h3>
                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">business</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                                <div>
                                    <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nama PT</dt>
                                    <dd className="text-sm font-bold text-slate-900">PT Maju Bersama Nusantara</dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Jenis Modal</dt>
                                    <dd className="text-sm font-bold text-slate-900">PT Penanaman Modal Dalam Negeri (PMDN)</dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Modal Dasar</dt>
                                    <dd className="text-sm font-bold text-slate-900">Rp 1.000.000.000</dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Bidang Usaha (KBLI)</dt>
                                    <dd className="text-sm font-bold text-slate-900">62019 - Jasa Pemrograman Lainnya</dd>
                                </div>
                                <div className="sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Alamat Kantor</dt>
                                    <dd className="text-sm font-bold text-slate-900 leading-relaxed">
                                        Graha Niaga, Lt. 12, Kav. 58, Jl. Jend. Sudirman, Jakarta Selatan, DKI Jakarta 12190
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg">Dokumen Persyaratan</h3>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                3 File Diunggah
                            </span>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* Document Item 1 */}
                                <div className="group relative rounded-2xl border-2 border-slate-100 overflow-hidden aspect-[4/5] bg-slate-50 transition-all hover:border-[#2a6ba7]/20">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover:opacity-20 transition-opacity">
                                        <div className="size-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4">
                                            <span className="material-symbols-outlined text-3xl">id_card</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate w-full">KTP Direktur.pdf</p>
                                    </div>
                                    <div className="absolute inset-0 bg-[#2a6ba7]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button className="size-10 bg-white rounded-xl flex items-center justify-center text-[#2a6ba7] shadow-xl hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                        <button className="size-10 bg-white rounded-xl flex items-center justify-center text-[#2a6ba7] shadow-xl hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">download</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Document Item 2 */}
                                <div className="group relative rounded-2xl border-2 border-slate-100 overflow-hidden aspect-[4/5] bg-slate-50 transition-all hover:border-[#2a6ba7]/20">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover:opacity-20 transition-opacity">
                                        <div className="size-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4">
                                            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate w-full">NPWP Pribadi.pdf</p>
                                    </div>
                                    <div className="absolute inset-0 bg-[#2a6ba7]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button className="size-10 bg-white rounded-xl flex items-center justify-center text-[#2a6ba7] shadow-xl hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                        <button className="size-10 bg-white rounded-xl flex items-center justify-center text-[#2a6ba7] shadow-xl hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">download</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Document Item 3 */}
                                <div className="group relative rounded-2xl border-2 border-slate-100 overflow-hidden aspect-[4/5] bg-slate-50 transition-all hover:border-[#2a6ba7]/20">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover:opacity-20 transition-opacity">
                                        <div className="size-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4">
                                            <span className="material-symbols-outlined text-3xl">home_work</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate w-full">Bukti Alamat.pdf</p>
                                    </div>
                                    <div className="absolute inset-0 bg-[#2a6ba7]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button className="size-10 bg-white rounded-xl flex items-center justify-center text-[#2a6ba7] shadow-xl hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                        <button className="size-10 bg-white rounded-xl flex items-center justify-center text-[#2a6ba7] shadow-xl hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">download</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Timeline */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <h3 className="font-black text-xl mb-8">Log Aktivitas</h3>
                        <div className="relative space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            {/* Step 1: Complete */}
                            <div className="relative flex gap-6">
                                <div className="z-10 size-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                    <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900 leading-tight">Data Terkirim</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">12 Okt 2023, 14:20 WIB</p>
                                    <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
                                        Formulir pendaftaran dan dokumen awal telah berhasil dikirim ke sistem.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2: Current */}
                            <div className="relative flex gap-6">
                                <div className="z-10 size-6 bg-[#2a6ba7] rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-[#2a6ba7]/20 ring-4 ring-[#2a6ba7]/10">
                                    <span className="size-1.5 bg-white rounded-full"></span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-[#2a6ba7] leading-tight">Menunggu Verifikasi</p>
                                    <p className="text-[10px] font-black text-amber-500 mt-1 uppercase tracking-widest animate-pulse">Sedang diproses</p>
                                    <p className="text-[11px] text-slate-500 mt-2 font-black leading-relaxed italic">
                                        Tim legal kami sedang memeriksa keaslian dan kelengkapan dokumen yang diunggah.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3: Pending */}
                            <div className="relative flex gap-6 opacity-40">
                                <div className="z-10 size-6 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white">
                                    <span className="size-1 bg-slate-400 rounded-full"></span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-400 leading-tight">Draft Akta Notaris</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Menunggu antrian</p>
                                </div>
                            </div>

                            {/* Step 4: Pending */}
                            <div className="relative flex gap-6 opacity-40">
                                <div className="z-10 size-6 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white">
                                    <span className="size-1 bg-slate-400 rounded-full"></span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-400 leading-tight">SK Kemenkumham</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Menunggu antrian</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-4">Butuh Revisi Cepat?</p>
                            <Link href="https://wa.me/6285333338818" target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group border border-slate-100 hover:border-[#2a6ba7]/20">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-white rounded-xl flex items-center justify-center text-[#2a6ba7] shadow-sm">
                                        <span className="material-symbols-outlined text-lg">support_agent</span>
                                    </div>
                                    <span className="text-xs font-black">Hubungi Support Legal</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-[#2a6ba7] group-hover:translate-x-1 transition-all text-sm">arrow_forward_ios</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
