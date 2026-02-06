import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kalkulator Biaya Transparan - Akses Legal Indonesia",
    description:
        "Hitung estimasi biaya legalitas usaha Anda secara instan. Tanpa biaya tersembunyi, khusus untuk UMK Indonesia. Pendirian PT, CV, HAKI dengan harga all-in.",
    keywords: [
        "kalkulator biaya legalitas",
        "harga pendirian PT",
        "harga pendirian CV",
        "biaya NIB",
        "biaya merek",
        "harga legalitas usaha",
        "akses legal harga",
        "estimasi biaya PT Perorangan",
    ],
    openGraph: {
        title: "Kalkulator Biaya Transparan - Akses Legal Indonesia",
        description:
            "Hitung estimasi biaya legalitas usaha Anda secara instan. Tanpa biaya tersembunyi.",
        type: "website",
        locale: "id_ID",
        siteName: "Akses Legal Indonesia",
    },
};

export default function HargaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
