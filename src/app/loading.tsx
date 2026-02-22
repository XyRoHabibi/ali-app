import Image from "next/image";

export default function Loading() {
    return (
        <div className="loading-route" aria-label="Loading" role="status">
            <div className="loading-route__content">
                <div className="loading-route__animation">
                    <Image
                        src="/loading-lottie-animate-2.gif"
                        alt="Loading animation"
                        width={160}
                        height={160}
                        priority
                        unoptimized
                    />
                </div>
                <div className="loading-route__text">
                    <span className="loading-route__subtitle">Memuat halaman...</span>
                </div>
            </div>
        </div>
    );
}
