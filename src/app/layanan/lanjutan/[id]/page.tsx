"use client";

import { use } from "react";
import Link from "next/link";
import { allServices } from "@/data/services";

export default function LanjutanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const serviceId = parseInt(id);
    const service = allServices.find(s => s.id === serviceId);

    if (!service) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="text-2xl font-bold">Layanan Tidak Ditemukan</h1>
                <Link href="/layanan" className="text-primary hover:underline">Kembali ke Katalog</Link>
            </div>
        );
    }

    const waMessage = encodeURIComponent(`Halo Akses Legal, saya ingin konsultasi mengenai ${service.name} (${service.price}).`);

    return (
        <div className="max-w-[1200px] mx-auto">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-white border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
                            <span className="material-symbols-outlined text-sm">{service.icon || 'verified'}</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Perizinan Lanjutan</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            {service.name}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed font-medium">
                            {service.description || `Layanan profesional untuk ${service.name} dengan proses cepat, transparan, dan harga terbaik. Cocok untuk kebutuhan bisnis Anda saat ini.`}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mulai Dari</span>
                                <span className="text-3xl font-black text-primary">{service.price}</span>
                            </div>
                            <div className="w-px h-12 bg-gray-200 mx-4 hidden sm:block"></div>
                            <a href={`https://wa.me/6285333338818?text=${waMessage}`}
                                target="_blank"
                                className="bg-primary text-white text-base font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/25">
                                <span className="material-symbols-outlined">chat</span>
                                Pesan Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-12">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-6">Kenapa Layanan Ini?</h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="size-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined">verified</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">Sertifikasi Resmi</h3>
                                        <p className="text-sm text-gray-500">Dijamin terdaftar resmi di instansi terkait dan sah secara hukum Indonesia.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="size-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined">speed</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">Proses Transparan</h3>
                                        <p className="text-sm text-gray-500">Pengerjaan efisien dengan estimasi waktu yang jelas dan transparan.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-6">Persyaratan Dasar</h2>
                                <ul className="space-y-4">
                                    {[
                                        "KTP Pemohon / Direktur Utama",
                                        "NPWP Perusahaan / Pribadi",
                                        "NIB (Nomor Induk Berusaha)",
                                        "Dokumen Pendukung Spesifik Layanan"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
                                            <span className="text-gray-600 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="relative">
                            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
                                <h3 className="font-black text-lg mb-4">Butuh Bantuan?</h3>
                                <p className="text-sm text-gray-500 mb-6">Konsultan kami siap membantu menjelaskan detail layanan ini kepada Anda.</p>
                                <a href={`https://wa.me/6285333338818?text=${waMessage}`} target="_blank"
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="size-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                                        <span className="material-symbols-outlined text-xl">perm_phone_msg</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">WhatsApp</p>
                                        <p className="font-bold text-gray-900">+62 853-3333-8818</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official Bank Partners Section */}
            <div className="px-6 py-12 md:py-24">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="relative z-10 max-w-5xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Official Bank Partners</span>
                            </div>

                            <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                                Kemudahan Akses Perbankan <br className="hidden md:block" />
                                untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Bisnis Anda</span>
                            </h3>

                            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 font-medium">
                                Kami telah bekerja sama dengan bank terkemuka di Indonesia untuk mempercepat proses pembukaan rekening perusahaan Anda.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { name: "Bank Mandiri", src: "https://upload.wikimedia.org/wikipedia/en/f/fa/Bank_Mandiri_logo.svg", h: "h-8 md:h-10" },
                                    { name: "Bank BNI", src: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg", h: "h-6 md:h-8" },
                                    { name: "Bank BSI", src: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg", h: "h-8 md:h-10" },
                                    { name: "Bank BRI", src: "https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg", h: "h-8 md:h-10" }
                                ].map((bank, idx) => (
                                    <div key={idx} className="group bg-white rounded-2xl p-6 md:p-8 flex items-center justify-center border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                        <img src={bank.src} alt={bank.name} className={`${bank.h} w-auto object-contain opacity-80 group-hover:opacity-100 transition-all`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <section id="paket-harga" className="px-6 py-12 md:py-24 my-12">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Paket Investasi Tunggal</h2>
                        <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">Satu harga jujur untuk kemajuan bisnis Anda tanpa biaya siluman.</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative flex flex-col md:flex-row items-center gap-12 p-8 md:p-16 rounded-[3rem] border-2 border-primary bg-white shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-primary px-10 py-3 rounded-bl-3xl">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Recommended</span>
                            </div>

                            <div className="flex-1 space-y-8">
                                <div>
                                    <h3 className="text-3xl font-black mb-2 text-gray-900">{service.name}</h3>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Paket All-in</p>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Layanan Profesional & Terpercaya",
                                        "Proses Cepat & Transparan",
                                        "Konsultasi Gratis dengan Ahli",
                                        "Legalitas Resmi & Sah"
                                    ].map((feature, fi) => (
                                        <li key={fi} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                                            <span className="material-symbols-outlined text-primary text-xl">verified</span>
                                            <span className="leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col items-center gap-6 p-10 bg-primary/5 rounded-[2rem] border border-primary/10 w-full md:w-auto min-w-[300px]">
                                <div className="text-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Total Investasi</span>
                                    <span className="text-5xl font-black text-primary tracking-tighter">{service.price}</span>
                                </div>
                                <div className="w-full space-y-4">
                                    <a href={`https://wa.me/6285333338818?text=${waMessage}`}
                                        target="_blank"
                                        className="w-full bg-primary text-white hover:bg-primary/90 font-black py-4 px-10 rounded-2xl text-center transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap">
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                        <span>Pesan Sekarang</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
