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
            <section className="relative pt-20 pb-32 overflow-hidden bg-white border-b border-gray-100 rounded-b-2xl">
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
            <section className="py-12 bg-gray-50">
                <div className="max-w-[1000px] mx-auto px-6">
                    {/* Section Header - More Compact */}
                    <div className="mb-10 text-center md:text-left">
                        <span className="inline-block rounded-full bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-3 border border-primary/20">
                            Persyaratan {service.name}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight tracking-tighter mb-2">
                            Siap Mendaftarkan {service.name}?
                        </h2>
                        <p className="text-gray-400 text-sm font-bold max-w-2xl leading-relaxed">
                            Pastikan proses pendaftaran {service.name} Anda berjalan lancar dengan menyiapkan dokumen berikut.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Requirements Card - Optimized Spacing */}
                        <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-lg shadow-gray-200/40 border border-gray-100">
                            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Dokumen & Data Utama</h3>
                                    <p className="mt-1 text-[11px] text-slate-400 font-bold leading-relaxed">
                                        Data wajib untuk proses pendaftaran kilat.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { title: "Nama Lengkap", desc: "Pribadi / Badan Usaha", icon: "person" },
                                    { title: "Dokumen Identitas", desc: "KTP, NPWP, dan NIB", icon: "assignment_ind" },
                                    { title: "Informasi Kontak", desc: "Nomor Telepon & Email", icon: "contact_phone" },
                                    { title: "Bidang Usaha", desc: "Deskripsi Produk/Layanan", icon: "business_center" },
                                    { title: "Alamat Lengkap", desc: "Kota & Alamat Detail", icon: "location_on" },
                                    { title: "Logo Usaha", desc: "Format JPG/PNG", icon: "draw" },
                                    { title: "Foto Pemohon", desc: "Latar Belakang Biru", icon: "account_circle" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 rounded-2xl bg-gray-50/50 p-4 border border-transparent hover:border-primary/10 hover:bg-white transition-all duration-300 group">
                                        <div className="size-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-gray-900 text-[12px] leading-tight mb-0.5 truncate">{item.title}</p>
                                            <p className="text-[10px] text-slate-400 font-bold leading-tight truncate">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deliverables Card & Help Section Grid - Reduced Height */}
                        <div className="grid lg:grid-cols-5 gap-6">
                            {/* Deliverables Card */}
                            <div className="lg:col-span-3 rounded-[2rem] bg-white p-6 md:p-8 shadow-lg shadow-gray-200/40 border border-gray-100">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined text-lg">verified</span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900">Output Layanan</h3>
                                </div>
                                <ul className="grid gap-3">
                                    {[
                                        { title: "Form pendaftaran resmi", detail: "7-14 hari kerja" },
                                        { title: "Sertifikat Merek Sah", detail: "~12 bulan proses" },
                                        { title: "Masa aktif 10 tahun", detail: "Dapat diperpanjang" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50">
                                            <div className="size-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-green-600 text-[12px] font-black">check</span>
                                            </div>
                                            <div className="flex flex-1 items-center justify-between gap-4">
                                                <p className="text-gray-900 font-black text-[11px]">{item.title}</p>
                                                <span className="text-[9px] text-slate-400 font-bold italic">{item.detail}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Help Section Card - Updated Content */}
                            <div className="lg:col-span-2 rounded-[2rem] bg-slate-900 p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-slate-900/10 min-h-[220px]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10">
                                    <h4 className="text-xl font-black mb-3 leading-tight">Dokumen belum lengkap?</h4>
                                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-6">
                                        Tim kami siap membantu siapkan dan cek kelayakan dokumen Anda secara gratis.
                                    </p>
                                </div>
                                <a href={`https://wa.me/6285333338818?text=${waMessage}`} target="_blank"
                                    className="relative z-10 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-[12px] font-black text-gray-900 hover:bg-primary hover:text-white transition-all duration-300 shadow-lg group">
                                    <span>Hubungi Tim Kami</span>
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
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

            {/* Brands Section */}
            <section className="relative overflow-hidden pb-24">
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                            MEREK YANG KAMI DAFTARKAN
                        </h2>
                    </div>

                    {/* Carousel Container */}
                    <div className="marquee-container py-8 md:py-12" data-aos="zoom-in">
                        <div className="animate-marquee items-center">
                            {[1, 2].flatMap((loopIdx) =>
                                [
                                    { i: 1, alt: "Dapur Mr. Chef" },
                                    { i: 2, alt: "Om Kembek" },
                                    { i: 3, alt: "Bungahen Dapoer" },
                                    { i: 4, alt: "Republik Pentol" },
                                    { i: 5, alt: "Lu Kudu" },
                                    { i: 6, alt: "Supersaji" },
                                    { i: 7, alt: "Metasyifa" },
                                    { i: 8, alt: "Herhopes" },
                                    { i: 9, alt: "Laal Shining Skin" },
                                    { i: 10, alt: "Aeera" },
                                    { i: 11, alt: "Social Barn" },
                                    { i: 12, alt: "Maju Abadi Perkasa" },
                                    { i: 13, alt: "The Makmur" },
                                    { i: 14, alt: "La-Data" },
                                    { i: 15, alt: "JS Cosmetik" },
                                    { i: 16, alt: "Catering Mayspa" },
                                    { i: 17, alt: "Halo Kopi" },
                                    { i: 18, alt: "NSJ Glow" },
                                    { i: 19, alt: "Anhar Foundation" },
                                    { i: 20, alt: "Intipaint" },
                                    { i: 21, alt: "Fitry Bakery" },
                                    { i: 22, alt: "Amazing Project" },
                                    { i: 23, alt: "Kabilah Atelier" },
                                    { i: 24, alt: "ITA Ilmu Tsunai Alquran" }
                                ].map((item) => (
                                    <div key={`${loopIdx}-${item.i}`} className="shrink-0 w-32 md:w-48 h-20 md:h-28 flex items-center justify-center p-4 bg-white/50 border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group/brand">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={`/testimoni/${item.i}.png`} alt={item.alt} title={item.alt} className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover/brand:grayscale-0 group-hover/brand:opacity-100 transition-all duration-300" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer Text */}
                    <div className="text-center mt-8 md:mt-12">
                        <p className="text-lg md:text-xl text-slate-600 font-semibold">
                            dan masih banyak merek lainnya...
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
