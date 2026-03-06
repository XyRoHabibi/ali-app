"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import Image from "next/image";

const CHANNEL_ID = "019ca236-76af-75da-99ef-7d12829dd140";
const SESSION_ID = "019ca236-7920-729b-beed-d1d4bb938242";
const SESSION_SECRET = "e5b987cc27844c0383d69658e24b166939912cb4aefe8fe4";
const CONTAINER_ID = "haloai-sidebar-embed";

const HEADER_HEIGHT = 80; // Dashboard top nav h-20 = 80px
const FLOAT_BOTTOM_OFFSET = 40; // bottom-10 = 40px
const FLOAT_ELEMENT_HEIGHT = 140; // GIF mascot ~110px

declare global {
    interface Window {
        HaloAI?: {
            ready?: Promise<HaloAIApi>;
        };
    }
}

interface HaloAIApi {
    openChatUi: (
        channelId: string,
        options: Record<string, unknown>
    ) => Promise<void>;
}

export default function HaloAIChat() {
    const scriptLoadedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const floatingRef = useRef<HTMLDivElement>(null);
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);
    const controls = useAnimation();

    // Show bubble after 2s, hide after 12s total (10s duration)
    useEffect(() => {
        const showTimer = setTimeout(() => {
            setShowBubble(true);
        }, 3000);

        const hideTimer = setTimeout(() => {
            setShowBubble(false);
        }, 10000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    useEffect(() => {
        if (scriptLoadedRef.current) return;
        scriptLoadedRef.current = true;

        const script = document.createElement("script");
        script.src = "https://www.haloai.co.id/embed/client.js";
        script.dataset.channelId = CHANNEL_ID;
        script.dataset.sessionId = SESSION_ID;
        script.dataset.sessionSecret = SESSION_SECRET;
        script.async = true;
        document.body.appendChild(script);

        const openChat = (api: HaloAIApi) => {
            if (!api || typeof api.openChatUi !== "function") {
                setIsLoading(false);
                setHasError(true);
                return;
            }

            api.openChatUi(CHANNEL_ID, {
                containerId: CONTAINER_ID,
                backgroundColor: "transparent",
                width: "100%",
                height: "100%",
                borderRadius: "0",
                shadow: "none",
                searchParams: { welcomeMessage: "" },
                sessionId: SESSION_ID,
                sessionSecret: SESSION_SECRET,
            })
                .then(() => setIsLoading(false))
                .catch((error: unknown) => {
                    console.error("HaloAI Embed: failed to initialize.", error);
                    setIsLoading(false);
                    setHasError(true);
                });
        };

        if (window.HaloAI?.ready) {
            window.HaloAI.ready
                .then((api) => openChat(api))
                .catch((err) => {
                    console.error("HaloAI ready rejected", err);
                    setIsLoading(false);
                    setHasError(true);
                });
        } else {
            window.addEventListener(
                "haloai:ready",
                (e) => openChat((e as CustomEvent).detail),
                { once: true }
            );
        }

        return () => {
            const s = document.querySelector(`script[data-channel-id="${CHANNEL_ID}"]`);
            if (s) s.remove();
        };
    }, []);
    // Lock body scroll when mobile chat is open
    useEffect(() => {
        if (isMobileOpen) {
            document.documentElement.classList.add("haloai-open");
            document.body.classList.add("haloai-open");
        } else {
            document.documentElement.classList.remove("haloai-open");
            document.body.classList.remove("haloai-open");
        }

        return () => {
            document.documentElement.classList.remove("haloai-open");
            document.body.classList.remove("haloai-open");
        };
    }, [isMobileOpen]);

    return (
        <>
            {/* Chat Modal Backdrop (Mobile only) */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99998] lg:hidden transition-opacity duration-300 touch-none"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Floating Assistant Button */}
            <motion.div
                ref={floatingRef}
                className={`fixed bottom-10 right-4 z-[99997] lg:hidden flex items-end justify-end transition-opacity duration-300 ${isMobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                drag
                dragMomentum={false}
                dragElastic={0.15}
                dragConstraints={{
                    left: -(typeof window !== 'undefined' ? window.innerWidth - 130 : 300),
                    right: 0,
                    top: -(typeof window !== 'undefined' ? window.innerHeight - FLOAT_BOTTOM_OFFSET - FLOAT_ELEMENT_HEIGHT - HEADER_HEIGHT : 500),
                    bottom: 20,
                }}
                style={{ x: dragX, y: dragY, touchAction: "none" }}
                animate={controls}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => {
                    // Snap X back to 0 (right edge) with a bouncy spring
                    controls.start({
                        x: 0,
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            mass: 0.8,
                        },
                    });

                    // Clamp Y so it doesn't go above the header
                    const currentY = dragY.get();
                    const maxUp = -(typeof window !== 'undefined' ? window.innerHeight - FLOAT_BOTTOM_OFFSET - FLOAT_ELEMENT_HEIGHT - HEADER_HEIGHT : 500);
                    if (currentY < maxUp) {
                        controls.start({
                            y: maxUp,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                            },
                        });
                    }

                    setTimeout(() => setIsDragging(false), 150);
                }}
            >
                {/* Chat Bubble (Disappears after 10s) */}
                <div
                    className={`relative mb-[50px] mr-[-15px] bg-[#2a6ba7] text-white text-[13px] whitespace-nowrap font-bold px-4 py-3 rounded-2xl shadow-xl shadow-blue-900/20 cursor-pointer hover:bg-[#1e4f7e] transition-all duration-500 z-0 ${showBubble ? 'opacity-100 scale-100 translate-x-0 animate-[float_3s_ease-in-out_infinite]' : 'opacity-0 scale-90 translate-x-4 pointer-events-none'}`}
                    onClick={(e) => {
                        if (isDragging) return e.preventDefault();
                        if (showBubble) setIsMobileOpen(true);
                    }}
                >
                    Hi, aku Legal Assistant <br />siap membantu
                    {/* Tail pointing right towards the gif */}
                    <div className="absolute -right-[8px] top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-l-[10px] border-transparent border-l-[#2a6ba7]"></div>
                </div>

                {/* GIF Mascot */}
                <button
                    onClick={(e) => {
                        if (isDragging) return e.preventDefault();
                        setIsMobileOpen(true);
                    }}
                    className="relative shrink-0 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 z-10"
                    aria-label="Buka Live Chat"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                        src="/legalassistant.gif"
                        alt="Legal Assistant"
                        width={100}
                        height={100}
                        className="object-contain drop-shadow-lg pointer-events-none"
                    />
                </button>
            </motion.div>

            {/* Chat Container */}
            <div
                className={`
                    group bg-white overflow-hidden flex flex-col shadow-sm transition-all duration-300
                    /* Desktop Styles */
                    hidden lg:flex lg:rounded-2xl lg:border lg:border-slate-200/80 lg:w-full lg:h-[640px] lg:hover:shadow-md lg:relative
                    /* Mobile Styles (Alert-like) */
                    ${isMobileOpen
                        ? "!fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-3rem)] sm:w-[380px] z-[99999] h-[75vh] min-h-[500px] max-h-[700px] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] !flex border border-slate-200"
                        : ""
                    }
                `}
                style={{ height: isMobileOpen ? undefined : '640px' }}
            >
                {/* ✨ Premium Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1e4f7e] via-[#2a6ba7] to-[#3b82c4] px-5 py-4 shrink-0">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-2 right-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" />

                    <div className="relative flex items-center justify-between gap-3.5">
                        <div className="flex items-center gap-3.5">
                            {/* Avatar with glow */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-md animate-pulse" />
                                <div className="relative h-11 w-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-2 ring-white/20">
                                    <span className="material-symbols-outlined text-white text-xl">
                                        <Image
                                            src="/legalassistant.gif"
                                            alt="Legal Assistant"
                                            width={110}
                                            height={110}
                                            className="pt-2"
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-[15px] tracking-tight">Legal Assistant</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                    </span>
                                    <span className="text-white/60 text-[11px] font-medium tracking-wide uppercase">Live Chat</span>
                                </div>
                            </div>

                            {/* HaloAI Badge */}
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://www.haloai.co.id/haloai/halo-ai-icon-contact.webp"
                                    alt="HaloAI"
                                    className="h-4 w-4 object-contain"
                                />
                                <span className="text-white/70 text-[10px] font-semibold tracking-wide hidden sm:inline">HaloAI</span>
                            </div>
                        </div>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden h-8 w-8 ml-auto bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                            aria-label="Tutup live chat"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>
                </div>

                {/* Chat Body — HaloAI Embed */}
                <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-b from-slate-50 to-white">
                            <div className="relative mb-4">
                                <div className="h-12 w-12 rounded-full bg-[#2a6ba7]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#2a6ba7] text-2xl animate-pulse">smart_toy</span>
                                </div>
                                <div className="absolute -inset-1 rounded-full border-2 border-[#2a6ba7]/20 border-t-[#2a6ba7] animate-spin" />
                            </div>
                            <p className="text-sm font-semibold text-slate-600">Menghubungkan...</p>
                            <p className="text-[11px] text-slate-400 mt-1">Menyiapkan live chat untuk Anda</p>
                        </div>
                    )}

                    {/* Error State */}
                    {hasError && !isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-b from-slate-50 to-white px-6">
                            <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-red-400 text-2xl">wifi_off</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 mb-1">Koneksi Gagal</p>
                            <p className="text-xs text-slate-400 text-center leading-relaxed">
                                Tidak dapat menghubungkan ke live chat. Silakan refresh halaman atau coba lagi nanti.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-[#2a6ba7] text-white text-xs font-bold rounded-xl hover:bg-[#1e4f7e] transition-colors"
                            >
                                Refresh Halaman
                            </button>
                        </div>
                    )}

                    {/* HaloAI iframe container */}
                    <div
                        id={CONTAINER_ID}
                        className="w-full h-full [&_div]:!shadow-none [&_div]:!rounded-none [&_iframe]:!rounded-none [&_iframe]:!shadow-none"
                    />
                </div>

                {/* Bottom accent line */}
                <div className="h-1 bg-gradient-to-r from-[#2a6ba7] via-emerald-400 to-[#3b82c4]" />
            </div>
        </>
    );
}
