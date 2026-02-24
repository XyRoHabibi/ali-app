"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface CarouselSlide {
    src: string;
    alt: string;
}

const slides: CarouselSlide[] = [
    { src: "/images/carousel1.png", alt: "Selamat datang di Akseslegal.id" },
    { src: "/images/carousel2.png", alt: "Merek Dagang" },
    { src: "/images/carousel3.png", alt: "Perizinan Gratis" },
];

export default function DashboardCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartRef = useRef<number>(0);
    const touchEndRef = useRef<number>(0);

    const goToSlide = (index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    };

    // Autoplay
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Reset autoplay on manual interaction
    const resetAutoplay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
    };

    const handlePrev = () => {
        prevSlide();
        resetAutoplay();
    };

    const handleNext = () => {
        nextSlide();
        resetAutoplay();
    };

    const handleDotClick = (index: number) => {
        goToSlide(index);
        resetAutoplay();
    };

    // Touch/swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndRef.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartRef.current - touchEndRef.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    };

    return (
        <div className="mb-10">
            <div
                className="relative w-full overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Slides Container */}
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="w-full flex-shrink-0 relative"
                            style={{ aspectRatio: "16/6" }}
                        >
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Slide sebelumnya"
                >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Slide berikutnya"
                >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentSlide
                                    ? "w-8 h-3 bg-[#2a6ba7] shadow-md shadow-[#2a6ba7]/30"
                                    : "w-3 h-3 bg-white/70 hover:bg-white border border-slate-200/50"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200/30">
                    <div
                        className="h-full bg-[#2a6ba7]/60 transition-all duration-500 ease-out"
                        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
