"use client";

import { useEffect, useRef } from "react";

const stats = [
    { value: 5, suffix: "+", label: "Tahun Pengalaman", color: "text-[#2a6ba7]" },
    { value: 2000, suffix: "+", label: "Klien Terbantu", color: "text-[#f3b444]" },
    { value: 1, suffix: "", label: "Hari Kerja (Kilat)", color: "text-[#2a6ba7]" },
    { value: 4.9, suffix: "", label: "Rating Sempurna", color: "text-[#f3b444]", isStar: true },
];

export default function Stats() {
    const countersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        const animateCounter = (element: HTMLElement, target: number, hasPlus: boolean) => {
            const duration = 2000;
            const steps = 60;
            const stepDuration = duration / steps;
            let current = 0;
            const increment = target / steps;
            const isDecimal = target % 1 !== 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                if (element) {
                    element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toString()) + (hasPlus && current >= target ? "+" : "");
                }
            }, stepDuration);
            timers.push(timer);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const counters = countersRef.current?.querySelectorAll("[data-counter]");
                        counters?.forEach((counter) => {
                            const element = counter as HTMLElement;
                            const target = parseFloat(element.dataset.counter || "0");
                            const hasPlus = element.dataset.plus === "true";
                            animateCounter(element, target, hasPlus);
                        });
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (countersRef.current) {
            observer.observe(countersRef.current);
        }

        return () => {
            observer.disconnect();
            timers.forEach(timer => clearInterval(timer));
        };
    }, []);

    return (
        <section className="py-10 border-y border-gray-100 bg-white relative z-20">
            <div className="max-w-[1200px] mx-auto px-6" ref={countersRef}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-center divide-x-0 md:divide-x divide-gray-100">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center text-center group cursor-default p-2"
                        >
                            <div className="flex items-center gap-1">
                                <span
                                    className={`text-4xl lg:text-5xl font-black ${stat.color} transition-transform group-hover:scale-110 duration-300`}
                                    data-counter={stat.value}
                                    data-plus={stat.suffix === "+" ? "true" : "false"}
                                >
                                    0
                                </span>
                                {stat.isStar && (
                                    <span className="material-symbols-outlined text-3xl text-[#f3b444] fill-1 animate-pulse">
                                        star
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
