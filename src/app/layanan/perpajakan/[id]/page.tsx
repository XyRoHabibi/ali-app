"use client";

import { use } from "react";
import Link from "next/link";
import { allServices } from "@/data/services";

export default function PerpajakanDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
                            <span className="text-xs font-bold uppercase tracking-wider">Perpajakan & Legal</span>
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
                                        <h3 className="font-bold text-lg mb-2">Legalitas Resmi</h3>
                                        <p className="text-sm text-gray-500">Dijamin terdaftar resmi di instansi terkait dan sah secara hukum Indonesia.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="size-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined">speed</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">Proses Cepat</h3>
                                        <p className="text-sm text-gray-500">Pengerjaan efisien dengan estimasi waktu yang jelas dan transparan.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-6">Persyaratan Dasar</h2>
                                <ul className="space-y-4">
                                    {[
                                        "KTP Pemohon (WNI)",
                                        "NPWP Pribadi (Aktif)",
                                        "Data Pendukung Tambahan (Sesuai Kebutuhan)"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
                                            <span className="text-gray-600">{item}</span>
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
                                <a href="https://wa.me/6285333338818" target="_blank"
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
        </div>
    );
}
