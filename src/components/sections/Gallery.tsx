"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Pool foto — akan di-shuffle dan didistribusikan ke banyak baris
const allPhotos = [
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(1).jpeg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(2).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(3).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(4).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(5).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(6).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(7).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(8).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(9).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(10).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(11).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(12).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(13).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(14).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(15).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(16).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(17).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(18).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(19).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(20).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(21).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(22).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(23).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(24).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(25).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(26).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(27).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(28).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(29).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(30).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(31).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(32).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(33).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(34).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(35).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(36).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(37).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(38).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(39).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(40).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(41).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(42).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(43).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(44).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(45).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(46).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(47).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(48).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(49).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(50).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(51).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(52).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(53).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(54).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(55).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(56).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(57).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(58).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(59).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(60).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(61).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(62).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(63).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(64).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(65).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(66).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(67).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(68).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(69).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(70).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(71).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(72).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(73).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(74).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(75).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(76).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(77).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(78).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(79).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(80).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(81).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(82).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(83).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(84).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(85).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(86).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(87).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(88).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(89).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(90).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(91).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(92).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(93).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(94).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(95).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(96).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(97).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(98).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(99).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(100).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(101).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(102).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(103).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(104).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(105).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(106).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(107).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(108).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(109).jpeg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(110).jpg",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(111).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(112).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(113).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(114).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(115).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(116).png",
    "https://cjcjlrhhmommkcrkzykj.supabase.co/storage/v1/object/public/Gallery/foto%20(117).png"
];

// Konfigurasi 5 baris dengan kecepatan & arah berbeda
const rowConfigs = [
    { speed: 60, reverse: false },
    { speed: 75, reverse: true },
    { speed: 55, reverse: false },
    { speed: 70, reverse: true },
    { speed: 65, reverse: false },
];

// Distribusi foto ke baris-baris
function buildRows(photos: string[], rowCount: number): string[][] {
    const perRow = Math.ceil(photos.length / rowCount);
    const rows: string[][] = [];
    for (let i = 0; i < rowCount; i++) {
        const start = i * perRow;
        rows.push(photos.slice(start, start + perRow));
    }
    return rows;
}

// Komponen satu baris marquee
function MarqueeStrip({
    photos,
    speed,
    reverse,
    onPhotoClick,
}: {
    photos: string[];
    speed: number;
    reverse: boolean;
    onPhotoClick: (src: string) => void;
}) {
    const [paused, setPaused] = useState(false);

    // 4x duplicate untuk seamless loop
    const items = [...photos, ...photos, ...photos, ...photos];

    return (
        <div
            className="gwall-strip"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div
                className={`gwall-track ${reverse ? "gwall-track-rev" : "gwall-track-fwd"}`}
                style={{
                    animationDuration: `${speed}s`,
                    animationPlayState: paused ? "paused" : "running",
                }}
            >
                {items.map((src, i) => (
                    <motion.div
                        key={i}
                        className="gwall-thumb"
                        whileHover={{ scale: 1.35, zIndex: 50, y: -4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        onClick={() => onPhotoClick(src)}
                    >
                        <Image
                            src={src}
                            alt="Dokumentasi penyerahan"
                            width={180}
                            height={260}
                            className="gwall-img"
                            loading="lazy"
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default function Gallery() {
    const sectionRef = useRef<HTMLElement>(null);
    const [rows, setRows] = useState<string[][]>([]);
    const [lightbox, setLightbox] = useState<string | null>(null);

    useEffect(() => {
        setRows(buildRows(allPhotos, rowConfigs.length));
    }, []);

    const closeLightbox = useCallback(() => setLightbox(null), []);

    useEffect(() => {
        if (lightbox) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [lightbox]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeLightbox]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("active");
                });
            },
            { threshold: 0.05 }
        );
        const els = sectionRef.current?.querySelectorAll(".reveal-up");
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section id="galeri" ref={sectionRef} className="gwall-section">
                {/* Decorative blurs */}
                <div className="gwall-blur gwall-blur-1" />
                <div className="gwall-blur gwall-blur-2" />

                {/* Header */}
                <div className="gwall-header reveal-up">
                    <div className="gwall-badge">
                        <span className="material-symbols-outlined text-[#2a6ba7] text-sm fill-1">
                            photo_library
                        </span>
                        <span className="gwall-badge-text">Galeri Dokumentasi</span>
                    </div>
                    <h2 className="gwall-title">
                        Ribuan Dokumen{" "}
                        <span className="text-[#2a6ba7]">Telah Diserahkan</span>
                    </h2>
                    <p className="gwall-subtitle">
                        Setiap foto adalah bukti nyata komitmen dan kepercayaan klien kami.
                    </p>
                </div>

                {/* Photo Wall */}
                <div className="gwall-container">
                    <div className="gwall-fade gwall-fade-l" />
                    <div className="gwall-fade gwall-fade-r" />

                    <div className="gwall-rows">
                        {rows.map((rowPhotos, i) => (
                            <MarqueeStrip
                                key={i}
                                photos={rowPhotos}
                                speed={rowConfigs[i].speed}
                                reverse={rowConfigs[i].reverse}
                                onPhotoClick={setLightbox}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        className="gwall-lb-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeLightbox}
                    >
                        <motion.div
                            className="gwall-lb-wrap"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeLightbox}
                                className="gwall-lb-close"
                                aria-label="Tutup"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                            <Image
                                src={lightbox.replace(/w=\d+&h=\d+/, "w=800&h=1200")}
                                alt="Dokumentasi penyerahan"
                                width={800}
                                height={1200}
                                className="gwall-lb-img"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
