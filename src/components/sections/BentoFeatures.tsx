"use client";

import { useEffect, useRef } from "react";

export default function BentoFeatures() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const revealElements = sectionRef.current?.querySelectorAll(".reveal-up");
        revealElements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 relative px-6 bg-white">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16 reveal-up">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Kenapa <span className="text-[#2a6ba7] italic">Founder Milenial</span>{" "}
                        Pilih Kami?
                    </h2>
                    <p className="text-lg text-gray-500 font-medium">
                        Kami mengerti kecepatan dan transparansi adalah segalanya bagi Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 reveal-up">
                    {/* Speed & Tech */}
                    <div className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-[#2a6ba7] to-blue-600 rounded-[3rem] p-10 text-white flex flex-col justify-between group overflow-hidden relative shadow-glow">
                        <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest">
                                <span className="flex h-2 w-2 rounded-full bg-[#f3b444] animate-ping" />
                                Live 24 Jam
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black leading-tight">
                                Serba Digital &<br />
                                Kilat
                            </h3>
                            <p className="text-white/80 font-medium max-w-sm">
                                Upload dokumen sambil ngopi. Tidak perlu antri, tidak perlu
                                macet-macetan.
                            </p>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-white/10 group-hover:rotate-12 transition-transform duration-700">
                            rocket_launch
                        </span>
                    </div>

                    {/* Tim Ahli */}
                    <div className="md:col-span-1 md:row-span-2 bg-[#f3b444] rounded-[3rem] p-10 flex flex-col justify-between group relative overflow-hidden shadow-glow-gold">
                        <div className="space-y-6 relative z-10">
                            <div className="size-14 rounded-2xl bg-white text-[#f3b444] flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-3xl">
                                    psychology
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-[#2a6ba7]">
                                Konsultan,
                                <br />
                                Bukan Admin
                            </h3>
                            <p className="text-[#2a6ba7]/80 font-medium leading-relaxed">
                                Tim kami adalah sarjana hukum berpengalaman yang mengerti celah
                                regulasi.
                            </p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>

                    {/* Transparency */}
                    <div className="md:col-span-1 md:row-span-1 bg-gray-50 rounded-[3rem] p-10 border border-gray-200 group hover:border-[#2a6ba7] transition-colors">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">
                            Tanpa Biaya Siluman
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Bayar sekali di awal, beres sampai tuntas.
                        </p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-[#2a6ba7]">Rp 0</span>
                            <span className="text-sm font-bold text-gray-400 mb-2">
                                Biaya Tambahan
                            </span>
                        </div>
                    </div>

                    {/* Data Security */}
                    <div className="md:col-span-1 md:row-span-1 bg-[#1a2c3d] rounded-[3rem] p-10 text-white flex flex-col justify-center relative overflow-hidden">
                        <h3 className="text-2xl font-black mb-2 relative z-10">
                            Data 100% Aman
                        </h3>
                        <p className="text-white/60 text-sm relative z-10">
                            Enkripsi bank-grade untuk dokumen Anda.
                        </p>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-white/5">
                            lock
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
