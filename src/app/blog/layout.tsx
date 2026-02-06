import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog & Edukasi Legal - PT Akses Legal Indonesia",
    description:
        "Update terbaru mengenai regulasi bisnis, tips legalitas UMK, dan panduan hukum praktis untuk pertumbuhan usaha Anda. Blog resmi Akses Legal Indonesia.",
    keywords: [
        "blog legalitas bisnis",
        "tips hukum UMKM",
        "panduan pendirian PT",
        "regulasi OSS RBA",
        "sertifikasi halal",
        "pendaftaran merek",
        "edukasi legal",
    ],
    openGraph: {
        title: "Blog & Edukasi Legal - PT Akses Legal Indonesia",
        description:
            "Update terbaru mengenai regulasi bisnis, tips legalitas UMK, dan panduan hukum praktis.",
        type: "website",
        locale: "id_ID",
        siteName: "Akses Legal Indonesia",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
