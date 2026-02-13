"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";

// Gallery photos - banyak foto untuk kesan "sibuk" dan "penuh"
const galleryPhotos = [
    { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop", alt: "Penyerahan dokumen PT" },
    { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&fit=crop", alt: "Konsultasi bisnis" },
    { src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=320&fit=crop", alt: "Kerja sama sukses" },
    { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=260&fit=crop", alt: "Sertifikat merek" },
    { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop", alt: "Diskusi tim & klien" },
    { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=280&fit=crop", alt: "Penyerahan akta notaris" },
    { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=340&fit=crop", alt: "Penandatanganan dokumen" },
    { src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&h=260&fit=crop", alt: "Klien puas" },
    { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop", alt: "Workshop legalitas" },
    { src: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&h=280&fit=crop", alt: "Konsultasi online" },
    { src: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=320&fit=crop", alt: "Kantor ALI" },
    { src: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=400&h=260&fit=crop", alt: "Serah terima NIB" },
    { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop", alt: "Meeting klien" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=280&fit=crop", alt: "Suasana kantor" },
    { src: "https://images.unsplash.com/photo-1553484771-047a44eee27b?w=400&h=340&fit=crop", alt: "Tim legal" },
    { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=260&fit=crop", alt: "Kerja tim" },
    { src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop", alt: "Dokumen resmi" },
    { src: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=280&fit=crop", alt: "Konsultasi tatap muka" },
    { src: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=320&fit=crop", alt: "Analisis dokumen" },
    { src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=260&fit=crop", alt: "Ruang meeting" },
    { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop", alt: "Kolaborasi tim" },
    { src: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=280&fit=crop", alt: "Perencanaan bisnis" },
    { src: "https://images.unsplash.com/photo-1600478689706-72a14c113679?w=400&h=340&fit=crop", alt: "Penyerahan sertifikat" },
    { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=260&fit=crop", alt: "Kerja profesional" },
];

// Bagi foto ke dalam 4 kolom dengan distribusi acak tapi seimbang
function distributePhotos(photos: typeof galleryPhotos, columnCount: number) {
    const columns: (typeof galleryPhotos)[] = Array.from(
        { length: columnCount },
        () => []
    );
    // Acak urutan foto
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    shuffled.forEach((photo, i) => {
        columns[i % columnCount].push(photo);
    });
    return columns;
}

// Komponen kolom yang bergerak vertikal
function ScrollColumn({
    photos,
    speed,
    reverse,
    columnIndex,
}: {
    photos: typeof galleryPhotos;
    speed: number;
    reverse: boolean;
    columnIndex: number;
}) {
    const [isPaused, setIsPaused] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const controls = useAnimationControls();
    const columnRef = useRef<HTMLDivElement>(null);
    const [columnHeight, setColumnHeight] = useState(0);

    // Duplicate photos for seamless loop
    const duplicated = [...photos, ...photos, ...photos];

    useEffect(() => {
        if (columnRef.current) {
            // Get height of one set of photos
            const singleSetHeight = columnRef.current.scrollHeight / 3;
            setColumnHeight(singleSetHeight);
        }
    }, [photos]);

    useEffect(() => {
        if (columnHeight === 0) return;

        if (isPaused) {
            controls.stop();
        } else {
            const direction = reverse ? [0, -columnHeight] : [-columnHeight, 0];
            controls.start({
                y: direction,
                transition: {
                    y: {
                        duration: speed,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                },
            });
        }
    }, [isPaused, columnHeight, speed, reverse, controls]);

    return (
        <div
            className="photowall-column"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
                setIsPaused(false);
                setHoveredIndex(null);
            }}
        >
            <motion.div
                ref={columnRef}
                className="photowall-track"
                animate={controls}
                initial={{ y: reverse ? 0 : -columnHeight || 0 }}
            >
                {duplicated.map((photo, i) => {
                    const uniqueKey = `${columnIndex}-${i}`;
                    const isHovered = hoveredIndex === i;
                    return (
                        <motion.div
                            key={uniqueKey}
                            className="photowall-item"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={{
                                scale: isHovered ? 1.08 : 1,
                                zIndex: isHovered ? 30 : 1,
                            }}
                            transition={{
                                scale: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                },
                            }}
                        >
                            <div
                                className={`photowall-card ${isHovered ? "photowall-card-hovered" : ""}`}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={400}
                                    height={300}
                                    className="photowall-image"
                                    loading="lazy"
                                />
                                {/* Hover overlay */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            className="photowall-overlay"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <motion.p
                                                className="photowall-label"
                                                initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{
                                                    duration: 0.25,
                                                    delay: 0.05,
                                                }}
                                            >
                                                {photo.alt}
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}

export default function Gallery() {
    const sectionRef = useRef<HTMLElement>(null);
    const [columns, setColumns] = useState<(typeof galleryPhotos)[]>([]);

    useEffect(() => {
        setColumns(distributePhotos(galleryPhotos, 4));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.05 }
        );

        const revealElements =
            sectionRef.current?.querySelectorAll(".reveal-up");
        revealElements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Kecepatan dan arah berbeda tiap kolom untuk kesan lebih dinamis & acak
    const columnSpeeds = [28, 35, 25, 32];
    const columnDirections = [false, true, false, true]; // false = scroll up, true = scroll down inverted

    return (
        <section
            id="galeri"
            ref={sectionRef}
            className="photowall-section"
        >
            {/* Background decorative blurs */}
            <div className="photowall-bg-blur photowall-bg-blur-1" />
            <div className="photowall-bg-blur photowall-bg-blur-2" />

            {/* Section Header */}
            <div className="photowall-header reveal-up">
                <div className="photowall-badge">
                    <span className="material-symbols-outlined text-[#2a6ba7] text-base fill-1">
                        photo_library
                    </span>
                    <span className="photowall-badge-text">
                        Galeri Dokumentasi
                    </span>
                </div>
                <h2 className="photowall-title">
                    Ribuan Dokumen{" "}
                    <span className="text-[#2a6ba7]">
                        Telah Diserahkan
                    </span>
                </h2>
                <p className="photowall-subtitle">
                    Setiap foto adalah bukti nyata kepercayaan klien kami.
                    Aktivitas penyerahan dokumen legalitas yang tidak pernah
                    berhenti.
                </p>
            </div>

            {/* Photo Wall Container */}
            <div className="photowall-container">
                {/* Side fade overlays */}
                <div className="photowall-fade photowall-fade-top" />
                <div className="photowall-fade photowall-fade-bottom" />

                {/* The scrolling columns */}
                <div className="photowall-grid">
                    {columns.map((colPhotos, i) => (
                        <ScrollColumn
                            key={i}
                            photos={colPhotos}
                            speed={columnSpeeds[i]}
                            reverse={columnDirections[i]}
                            columnIndex={i}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="photowall-cta reveal-up">
                <p className="photowall-cta-text">
                    Ingin bisnis Anda juga terdokumentasi di sini?
                </p>
                <a
                    href="https://wa.me/6285333338818?text=Halo%20Admin,%20saya%20mau%20konsultasi%20pendirian%20usaha."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="photowall-cta-button"
                >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    Mulai Perjalanan Legal Anda
                </a>
            </div>
        </section>
    );
}
