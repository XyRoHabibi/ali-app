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
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" className="absolute -bottom-10 -right-10 w-[200px] h-[200px] text-white/10 group-hover:rotate-12 transition-transform duration-700 fill-current" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m226-559 78 33q14-28 29-54t33-52l-56-11-84 84Zm142 83 114 113q42-16 90-49t90-75q70-70 109.5-155.5T806-800q-72-5-158 34.5T492-656q-42 42-75 90t-49 90Zm155-121.5q0-33.5 23-56.5t57-23q34 0 57 23t23 56.5q0 33.5-23 56.5t-57 23q-34 0-57-23t-23-56.5ZM565-220l84-84-11-56q-26 18-52 32.5T532-299l33 79Zm313-653q19 121-23.5 235.5T708-419l20 99q4 20-2 39t-20 33L538-80l-84-197-171-171-197-84 167-168q14-14 33.5-20t39.5-2l99 20q104-104 218-147t235-24ZM157-321q35-35 85.5-35.5T328-322q35 35 34.5 85.5T327-151q-25 25-83.5 43T82-76q14-103 32-161.5t43-83.5Zm57 56q-10 10-20 36.5T180-175q27-4 53.5-13.5T270-208q12-12 13-29t-11-29q-12-12-29-11.5T214-265Z" /></svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" className="absolute -bottom-5 -right-4 w-[130px] h-[130px] text-white/5 group-hover:rotate-12 transition-transform duration-700 fill-current" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" /></svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
