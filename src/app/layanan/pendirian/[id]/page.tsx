"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { allServices, serviceFlowConfigs, getServiceFlowType } from "@/data/services";
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
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter">
                            {service.name.includes("Pendirian") ? "" : "Pendirian "}{service.name}: <br className="hidden md:block" />
                            <span className="text-primary">Cepat, Murah, &amp; Resmi.</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
                            {service.description || "Solusi legalitas terbaik untuk UMKM Indonesia. Proses kilat dengan harga paling terjangkau. Mulai langkah besar usaha Anda hari ini dengan pendampingan profesional."}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <a href={`https://wa.me/6285333338818?text=${waMessage}`}
                                target="_blank"
                                className="bg-primary text-white text-base font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                <span>Mulai Sekarang</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
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

            {/* Feature Section */}
            <section className="px-6 py-12 md:py-16 bg-white/50 rounded-[2rem] md:rounded-[2.5rem] my-4 md:my-8 border border-gray-100">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900">Kenapa Memilih PT Akses Legal Indonesia?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Kami memberikan layanan terbaik untuk membantu legalitas bisnis Anda berkembang lebih cepat tanpa repot.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 transition-all">
                        <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">bolt</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Proses Kilat</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Selesai dalam 1-3 hari kerja tanpa hambatan birokrasi yang rumit.</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 transition-all">
                        <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">receipt_long</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Harga Transparan</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Tanpa biaya tersembunyi. Semua biaya dijelaskan secara jujur sejak awal konsultasi.</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 transition-all">
                        <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">shield_person</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Tim Ahli</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Didampingi konsultan hukum dan notaris berpengalaman selama proses pendirian.</p>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 overflow-hidden">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-gray-900">Alur Pendirian {service.name}</h2>
                    <p className="text-gray-600">Proses transparan dari awal hingga legalitas Anda terbit.</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Progress Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="progress-line w-full rounded-full"
                            style={{ height: `${progressHeight}%` }}
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
                                >
                                    <div className={`step-connector absolute left-8 ${connectorPos} top-1/2 -translate-y-1/2`}>
                                        <div className="step-badge size-14 bg-white rounded-2xl border-4 border-gray-300 shadow-lg flex items-center justify-center transition-all duration-500">
                                            <span className="step-number text-gray-400 font-black text-xl">{stepNum}</span>
                                        </div>
                                    </div>
                                    <div className="step-card p-5 bg-white rounded-2xl border-2 border-gray-100 shadow-lg transition-all duration-500 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className={`flex items-center gap-3 ${!isEven ? 'md:justify-end' : ''} mb-3`}>
                                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                    <span className="step-icon material-symbols-outlined text-2xl text-primary">{step.icon}</span>
                                                </div>
                                            </div>
                                            <h3 className="step-title text-lg font-bold mb-1">{step.title}</h3>
                                            <p className="step-desc text-xs text-gray-500 mb-2 leading-relaxed">{step.desc}</p>
                                            <div className={`flex items-center gap-2 ${!isEven ? 'md:justify-end' : ''}`}>
                                                {step.time && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">
                                                        <span className="material-symbols-outlined text-xs">schedule</span>
                                                        {step.time}
                                                    </span>
                                                )}
                                                {step.detail && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">
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
        </div>
    );
}
