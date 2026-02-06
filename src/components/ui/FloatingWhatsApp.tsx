import Link from "next/link";

export default function FloatingWhatsApp() {
    return (
        <Link
            href="https://wa.me/6285333338818?text=Halo%20Akses%20Legal,%20saya%20butuh%20bantuan%20cepat."
            target="_blank"
            className="fixed bottom-8 right-8 z-50 size-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:scale-110 transition-transform active:scale-95"
        >
            <span className="material-symbols-outlined text-3xl">chat</span>
        </Link>
    );
}
