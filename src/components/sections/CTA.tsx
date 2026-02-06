"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CTA() {
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

        // Observe the section itself if it has reveal-up
        if (sectionRef.current?.classList.contains("reveal-up")) {
            observer.observe(sectionRef.current);
        }

        const revealElements = sectionRef.current?.querySelectorAll(".reveal-up");
        revealElements?.forEach((el) => observer.observe(el));

        // Trigger immediately for elements already in viewport
        setTimeout(() => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    sectionRef.current.classList.add("active");
                }
            }
            revealElements?.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add("active");
                }
            });
        }, 100);

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="mb-20 px-6 reveal-up">
            <div className="max-w-[1200px] mx-auto px-0">
                <div className="bg-gradient-to-br from-[#2a6ba7] to-[#1a2c3d] rounded-[3rem] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 overflow-hidden relative shadow-2xl shadow-[#2a6ba7]/30">
                    {/* Decor */}
                    <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4 animate-float pointer-events-none">
                        <Image
                            src="/images/logo-color.png"
                            alt="ALI Logo BG"
                            width={500}
                            height={500}
                            className="w-[500px] h-auto grayscale invert"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col gap-6 max-w-xl text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-black leading-tight">
                            Jangan Tunda Legalitas, <br />
                            <span className="text-[#f3b444]">
                                Bisnis Aman, Rezeki Lancar!
                            </span>
                        </h2>
                        <p className="text-lg text-white/80 font-medium">
                            Konsultasikan kebutuhan Anda sekarang gratis. Tim kami siap
                            membantu 24/7.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start mt-4">
                            <Link
                                href="https://wa.me/6285333338818?text=Halo%20Admin,%20saya%20mau%20konsultasi%20pendirian%20PT."
                                target="_blank"
                                className="h-16 px-10 bg-[#f3b444] text-[#2a6ba7] font-black text-lg rounded-2xl shadow-lg shadow-[#f3b444]/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                            >
                                <i className="fa-brands fa-whatsapp text-2xl"></i>
                                Chat WhatsApp
                            </Link>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full lg:w-auto">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                            <span className="block text-3xl font-black text-[#f3b444]">
                                5rb+
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                                Pengusaha
                            </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                            <span className="block text-3xl font-black text-[#f3b444]">
                                100%
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                                Legal
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
