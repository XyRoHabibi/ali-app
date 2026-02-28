"use client";

import { useEffect, useRef, useState } from "react";

const CHANNEL_ID = "019ca236-76af-75da-99ef-7d12829dd140";
const SESSION_ID = "019ca236-7920-729b-beed-d1d4bb938242";
const SESSION_SECRET = "e5b987cc27844c0383d69658e24b166939912cb4aefe8fe4";
const CONTAINER_ID = "haloai-sidebar-embed";

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

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300" style={{ height: "640px" }}>
            {/* ✨ Premium Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1e4f7e] via-[#2a6ba7] to-[#3b82c4] px-5 py-4">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-2 right-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" />

                <div className="relative flex items-center gap-3.5">
                    {/* Avatar with glow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-md animate-pulse" />
                        <div className="relative h-11 w-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-2 ring-white/20">
                            <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-[15px] tracking-tight">Ali Assistant</h3>
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
                        <span className="text-white/70 text-[10px] font-semibold tracking-wide">HaloAI</span>
                    </div>
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
    );
}
