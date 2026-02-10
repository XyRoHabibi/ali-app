"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
    allServices,
    serviceFlowConfigs,
    getServiceFlowType,
    getComparisonTableKey,
    pricingPackagesData,
    getUMKHeader,
    getUMKDescription,
    getUMKFeatures
} from "@/data/services";
import "./detail-layanan.css";

export default function PendirianDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const serviceId = parseInt(id);
    const service = allServices.find(s => s.id === serviceId);

    const [currentStep, setCurrentStep] = useState(0);
    const [progressHeight, setProgressHeight] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const flowType = service ? getServiceFlowType(service.name) : 'default';
    const steps = serviceFlowConfigs[flowType as keyof typeof serviceFlowConfigs] || serviceFlowConfigs.default;

    useEffect(() => {
        if (!steps.length) return;

        let interval = setInterval(() => {
            setCurrentStep(prev => {
                const next = (prev + 1) % (steps.length + 1);

                if (next === 0) {
                    setCompletedSteps([]);
                    setProgressHeight(0);
                    return 0;
                }

                setCompletedSteps(prevComp => [...prevComp, prev]);
                setProgressHeight((next / steps.length) * 100);
                return next;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [steps.length]);

    if (!service) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="text-2xl font-bold">Layanan Tidak Ditemukan</h1>
                <Link href="/layanan" className="text-primary hover:underline">Kembali ke Katalog</Link>
            </div>
        );
    }

    const waMessage = encodeURIComponent(`Halo Akses Legal, saya ingin konsultasi mengenai ${service.name} (${service.price}).`);

    // UMK Data
    const umkHeader = getUMKHeader(service.name);
    const umkDesc = getUMKDescription(service.name);
    const umkFeatures = getUMKFeatures(service.name);

    // Comparison Table Data
    const tableKey = getComparisonTableKey(service.name);
    const tableData = pricingPackagesData.find(p => p.id === tableKey)?.comparisonTable;

    return (
        <div className="max-w-[1200px] mx-auto px-6">
            {/* Hero Section */}
            <section className="py-12 md:py-20">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-[#F3B444]/10 text-[#F3B444] px-4 py-1.5 rounded-full border border-[#F3B444]/20">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Garansi Harga Terendah</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter">
                            {service.name.includes("Pendirian") ? "" : "Pendirian "}{service.name}: <br className="hidden md:block" />
                            <span className="text-primary">Cepat, Murah, & Resmi.</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
                            {service.description || "Solusi legalitas terbaik untuk UMKM Indonesia. Proses kilat dengan harga paling terjangkau. Mulai langkah besar usaha Anda hari ini dengan pendampingan profesional."}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <a href={`https://wa.me/6285333338818?text=${waMessage}`}
                                target="_blank"
                                className="bg-primary text-white text-base font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 group shadow-xl shadow-primary/20">
                                <span>Mulai Sekarang</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-[500px]">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl"></div>
                            <div className="relative bg-white p-4 rounded-3xl border border-gray-100 shadow-xl overflow-hidden aspect-video group">
                                <div className="w-full h-full bg-cover bg-center rounded-2xl"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}>
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section (Kenapa) */}
            <section className="px-6 py-12 md:py-16 bg-white/50 rounded-[2rem] md:rounded-[2.5rem] my-4 md:my-8 border border-gray-100">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900">Kenapa Memilih PT Akses Legal Indonesia?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Kami memberikan layanan terbaik untuk membantu legalitas bisnis Anda berkembang lebih cepat tanpa repot.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 transition-all shadow-sm">
                        <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">bolt</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Proses Kilat</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">Selesai dalam 1-3 hari kerja tanpa hambatan birokrasi yang rumit.</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 transition-all shadow-sm">
                        <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">receipt_long</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Harga Transparan</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">Tanpa biaya tersembunyi. Semua biaya dijelaskan secara jujur sejak awal konsultasi.</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 transition-all shadow-sm">
                        <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">shield_person</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Tim Ahli</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">Didampingi konsultan hukum dan notaris berpengalaman selama proses pendirian.</p>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 overflow-hidden">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-gray-900">Alur Pendirian {service.name}</h2>
                    <p className="text-gray-600 font-medium">Proses transparan dari awal hingga legalitas Anda terbit.</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Progress Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="bg-primary w-full rounded-full transition-all duration-700 ease-out"
                            style={{ height: `${progressHeight}%`, boxShadow: "0 0 20px rgba(11, 64, 154, 0.4)" }}
                        ></div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-y-12">
                        {steps.map((step: any, index: number) => {
                            const stepNum = index + 1;
                            const isEven = stepNum % 2 === 0;
                            const isActive = currentStep === index;
                            const isCompleted = completedSteps.includes(index);
                            const alignClass = isEven ? "md:pl-16" : "md:pl-0 md:text-right md:pr-16";
                            const connectorPos = isEven ? "md:left-0 md:-translate-x-1/2" : "md:left-auto md:right-0 md:translate-x-1/2";

                            return (
                                <div
                                    key={index}
                                    className={`timeline-step pl-20 ${alignClass} relative ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isEven ? 'md:z-10' : ''}`}
                                    style={{ opacity: isActive || isCompleted ? 1 : 0.5, transition: 'all 0.5s ease' }}
                                >
                                    <div className={`absolute left-8 ${connectorPos} top-1/2 -translate-y-1/2 z-20`}>
                                        <div className={`size-14 bg-white rounded-2xl border-4 ${isActive || isCompleted ? 'border-primary' : 'border-gray-200'} shadow-lg flex items-center justify-center transition-all duration-500`}>
                                            <span className={`text-xl font-black ${isActive || isCompleted ? 'text-primary' : 'text-gray-400'}`}>{stepNum}</span>
                                        </div>
                                    </div>
                                    <div className={`p-5 bg-white rounded-2xl border-2 ${isActive ? 'border-primary/30 shadow-2xl scale-[1.02]' : 'border-gray-100 shadow-lg'} transition-all duration-500 relative overflow-hidden group`}>
                                        <div className="relative z-10">
                                            <div className={`flex items-center gap-3 ${!isEven ? 'md:justify-end' : ''} mb-3`}>
                                                <div className={`size-12 rounded-xl ${isActive || isCompleted ? 'bg-primary/20' : 'bg-gray-100'} flex items-center justify-center transition-colors`}>
                                                    <span className={`material-symbols-outlined text-2xl ${isActive || isCompleted ? 'text-primary' : 'text-gray-400'}`}>{step.icon}</span>
                                                </div>
                                            </div>
                                            <h3 className={`text-lg font-bold mb-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-900'}`}>{step.title}</h3>
                                            <p className="text-xs text-gray-500 mb-2 leading-relaxed font-medium">{step.desc}</p>
                                            <div className={`flex items-center gap-2 ${!isEven ? 'md:justify-end' : ''}`}>
                                                {step.time && (
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${isActive || isCompleted ? 'text-primary bg-primary/10' : 'text-gray-400 bg-gray-100'} px-2 py-1 rounded-full transition-colors`}>
                                                        <span className="material-symbols-outlined text-xs">schedule</span>
                                                        {step.time}
                                                    </span>
                                                )}
                                                {step.detail && (
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${isActive || isCompleted ? 'text-primary bg-primary/10' : 'text-gray-400 bg-gray-100'} px-2 py-1 rounded-full transition-colors`}>
                                                        <span className="material-symbols-outlined text-xs">verified</span>
                                                        {step.detail}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* UMK Focus Section */}
            <section className="px-6 py-12 md:py-24">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined !text-[10rem] leading-none">storefront</span>
                        </div>
                        <div className="max-w-2xl relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                {umkHeader.badge}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight" dangerouslySetInnerHTML={{ __html: umkHeader.title }}></h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: umkDesc }}></p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {umkFeatures.map((f: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 font-bold text-gray-700">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table Section */}
            {tableData && (
                <div className="px-6 pb-20">
                    <div className="max-w-[1200px] mx-auto space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <h3 className="text-2xl font-black tracking-tight text-gray-900">Detail Perbandingan Fitur</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>

                        <div className="overflow-x-auto rounded-[2rem] border border-gray-200 shadow-sm no-scrollbar">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-200">
                                        <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-400">Fitur Layanan</th>
                                        {tableData.headers.map((h: any, i: number) => (
                                            <th key={i} className={`p-8 text-center text-sm font-black text-primary ${h.cssClass}`}>
                                                {h.label}
                                                <span className="block text-[11px] font-bold text-gray-500 mt-1">{h.price}</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tableData.features.map((f: any, i: number) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-8 text-sm font-bold text-gray-700">{f.name}</td>
                                            {tableData.headers.map((h: any, hi: number) => (
                                                <td key={hi} className={`p-8 text-center ${h.cssClass}`}>
                                                    {f.status[h.key] ? (
                                                        <span className="material-symbols-outlined text-green-500 fill-1">check_circle</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-gray-300">cancel</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Bank Partners Section */}
            <div className="px-6 py-24">
                <div className="bg-white dark:bg-gray-800 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Rekanan Bank Resmi</p>
                        <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-12 tracking-tight leading-tight">
                            Kini Buka Rekening Perusahaan <br /> Jadi Jauh <span className="text-primary">Lebih Mudah</span>
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 hover:opacity-100 transition-opacity duration-500">
                            <img src="https://upload.wikimedia.org/wikipedia/en/f/fa/Bank_Mandiri_logo.svg" alt="Bank Mandiri" className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg" alt="Bank BNI" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg" alt="Bank BSI" className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg" alt="Bank BRI" className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Cards Section */}
            {tableData && (
                <section className="px-6 py-12 md:py-24 my-12">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Investasi Transparan</h2>
                            <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">Satu harga jujur untuk kemajuan bisnis Anda tanpa biaya siluman.</p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-12">
                            {tableData.headers.map((header: any, index: number) => {
                                const pkgShort = header.label.replace(/^Paket\s+/i, '').trim().toLowerCase();
                                const enabledFeatures = tableData.features.filter((f: any) => f.status && f.status[header.key]);

                                if (index === 0) {
                                    // Paket Standard / Primary Choice Card
                                    return (
                                        <div key={index} className="relative flex flex-col md:flex-row items-center gap-12 p-8 md:p-16 rounded-[3rem] border-2 border-primary bg-white shadow-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                            <div className="absolute top-0 right-0 bg-primary px-10 py-3 rounded-bl-3xl z-20">
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">{header.subLabel || 'Best Value for UMK'}</span>
                                            </div>

                                            <div className="flex-[1.5] space-y-8">
                                                <div>
                                                    <h3 className="text-3xl font-black mb-2 text-gray-900">{header.label}</h3>
                                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{header.subLabel}</p>
                                                </div>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                                    {enabledFeatures.map((f: any, fi: number) => (
                                                        <li key={fi} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                                                            <span className="material-symbols-outlined text-primary text-xl">verified</span>
                                                            <span className="leading-tight">{f.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex flex-col items-center gap-6 p-10 bg-primary/5 rounded-[2rem] border border-primary/10 w-full md:w-auto min-w-[300px]">
                                                <div className="text-center">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Total Investasi</span>
                                                    <span className="text-5xl font-black text-primary tracking-tighter">{header.price}</span>
                                                </div>
                                                <div className="w-full space-y-4">
                                                    <a href={`https://wa.me/6285333338818?text=${encodeURIComponent(`Halo admin, saya ingin ambil ${service.name} - ${header.label}`)}`}
                                                        target="_blank"
                                                        className="w-full bg-primary text-white hover:bg-primary/90 font-black py-4 px-10 rounded-2xl text-center transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap">
                                                        <span className="material-symbols-outlined">rocket_launch</span>
                                                        <span>Daftar Sekarang</span>
                                                    </a>
                                                    <a href={`https://wa.me/6285333338818?text=${encodeURIComponent(`Halo admin, saya mau tanya-tanya dulu tentang ${service.name} - ${header.label}`)}`}
                                                        target="_blank"
                                                        className="w-full bg-white text-primary border border-primary/20 hover:bg-gray-50 font-black py-4 px-10 rounded-2xl text-center transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                                                        <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l121.7-31.9c32.4 17.8 68.9 27.2 106.4 27.2h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-4-10.5-6.7z" /></svg>
                                                        <span>Konsultasi sekarang</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    // Paket Lengkap + VO / Secondary Card
                                    const isVO = header.label.toLowerCase().includes('+ vo');

                                    return (
                                        <div key={index} className="relative flex flex-col md:flex-row items-center gap-12 p-8 md:p-10 rounded-[2rem] border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-primary/10 px-6 py-2 rounded-bl-2xl">
                                                <span className="text-primary text-[10px] font-black uppercase tracking-widest">{header.subLabel || 'Recommended'}</span>
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900">{header.label}</h3>
                                                    <p className="text-gray-500 font-medium text-xs mt-1 uppercase tracking-widest">{header.subLabel}</p>
                                                </div>
                                                <div className="flex items-baseline gap-1 mb-6">
                                                    <span className="text-4xl font-black text-primary tracking-tighter">{header.price}</span>
                                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">All-in</span>
                                                </div>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                                    {isVO ? (
                                                        <>
                                                            {[
                                                                "Surat Pernyataan",
                                                                "Free 10 KBLI Pada Surat Pernyataan*",
                                                                "SK Menteri",
                                                                "Akun Coretax",
                                                                "NPWP Perusahaan",
                                                                "Akun OSS*",
                                                                "NIB Perusahaan*",
                                                                "Free 5 KBLI pada NIB*",
                                                                "Konsultasi Legalitas",
                                                                "Free 50 Draft Perjanjian",
                                                                "Desain Logo",
                                                                "Desain Stempel",
                                                                "Email Perusahaan",
                                                                "Pembukaan Rekening*",
                                                                "Penggunaan Alamat Kantor (Makassar/Kendari/Palu)"
                                                            ].map((feature, fi) => (
                                                                <li key={fi} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                                                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                                                    <span className="leading-tight">{feature}</span>
                                                                </li>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        enabledFeatures.slice(0, 6).map((f: any, fi: number) => (
                                                            <li key={fi} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                                                                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                                                <span className="leading-tight">{f.name}</span>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="w-full md:w-[260px] flex flex-col gap-4">
                                                <a href={`https://wa.me/6285333338818?text=${encodeURIComponent(`Halo admin, saya ingin ambil ${service.name} - ${header.label}`)}`}
                                                    target="_blank"
                                                    className="w-full bg-primary text-white hover:bg-primary/90 font-black py-4 px-8 rounded-2xl text-center transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap">
                                                    <span className="material-symbols-outlined">rocket_launch</span>
                                                    <span>Daftar Sekarang</span>
                                                </a>
                                                <a href={`https://wa.me/6285333338818?text=${encodeURIComponent(`Halo admin, saya mau tanya-tanya dulu tentang ${service.name} - ${header.label}`)}`}
                                                    target="_blank"
                                                    className="w-full bg-gray-50 text-primary border border-gray-100 hover:bg-primary hover:text-white font-black py-4 px-8 rounded-2xl text-center transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                                                    <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l121.7-31.9c32.4 17.8 68.9 27.2 106.4 27.2h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-4-10.5-6.7z" /></svg>
                                                    <span>Konsultasi sekarang</span>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA Section */}
            <section className="px-6 py-20 text-center">
                <div className="max-w-5xl mx-auto bg-primary p-12 md:p-16 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(11,64,154,0.5)]">
                    {/* Background Blurs from Premium */}
                    <div className="absolute top-0 right-0 size-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 size-80 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>

                    <h2 className="text-2xl md:text-5xl font-black tracking-tight relative z-10">
                        Siap Naik Kelas Bareng <br className="md:hidden" /> PT Akses Legal Indonesia?
                    </h2>
                    <p className="text-sm md:text-lg text-[#F3B444] text-accent bg-white/10 inline-block px-4 md:px-6 py-2 rounded-full font-bold md:font-medium relative z-10">
                        Dapatkan Konsultasi Gratis Sekarang!
                    </p>

                    <div className="flex justify-center relative z-10">
                        <a href={`https://wa.me/6285333338818?text=${encodeURIComponent(`Halo Akses Legal, saya siap mendirikan ${service.name}.`)}`}
                            target="_blank"
                            className="bg-white text-primary text-lg font-black px-12 py-5 rounded-2xl hover:bg-gray-50 hover:shadow-xl transition-all flex items-center justify-center gap-3 group">
                            <span>Hubungi Legal Kami</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">headset_mic</span>
                        </a>
                    </div>

                    {/* Emoticons from Premium */}
                    <div className="absolute top-10 left-10 text-6xl opacity-10 rotate-12">⚖️</div>
                    <div className="absolute bottom-10 right-10 text-6xl opacity-10 -rotate-12">📄</div>
                </div>
            </section>
        </div>
    );
}
