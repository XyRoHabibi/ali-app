"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Wait for the page to be fully loaded
        const handleLoad = () => {
            // Add a minimum display time so the animation is visible
            setTimeout(() => {
                setIsFadingOut(true);
                // Remove from DOM after fade-out animation
                setTimeout(() => {
                    setIsLoading(false);
                }, 600);
            }, 1500);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`loading-screen ${isFadingOut ? "loading-screen--fade-out" : ""}`}
            aria-label="Loading"
            role="status"
        >
            <div className="loading-screen__content">
                <div className="loading-screen__animation">
                    <Image
                        src="/loading-lottie-animate-2.gif"
                        alt="Loading animation"
                        width={200}
                        height={200}
                        priority
                        unoptimized
                    />
                </div>
                <div className="loading-screen__text">
                    <span className="loading-screen__brand">Akses Legal Indonesia</span>
                    <span className="loading-screen__subtitle">Memuat halaman...</span>
                </div>
            </div>
        </div>
    );
}
