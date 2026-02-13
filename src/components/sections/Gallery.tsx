"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Pool foto — akan di-shuffle dan didistribusikan ke banyak baris
const allPhotos = [
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1560264280-88b68371db39?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1553484771-047a44eee27b?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1600478689706-72a14c113679?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1557425955-df376b5903c8?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=240&h=160&fit=crop",
    "https://images.unsplash.com/photo-1560264280-88b68371db39?w=240&h=160&fit=crop",
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
                            width={240}
                            height={160}
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
                                src={lightbox.replace(/w=\d+&h=\d+/, "w=1200&h=900")}
                                alt="Dokumentasi penyerahan"
                                width={1200}
                                height={900}
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
