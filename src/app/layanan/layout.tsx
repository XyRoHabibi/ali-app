import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Katalog Layanan Lengkap - Akses Legal Indonesia",
    description:
        "Pilih solusi legalitas yang sesuai dengan kebutuhan skala bisnis Anda. Pendirian PT, CV, Yayasan, HAKI, dan perizinan usaha lainnya dengan harga transparan.",
    keywords: [
        "layanan legalitas",
        "pendirian PT",
        "pendirian CV",
        "PT Perorangan",
        "HAKI",
        "NIB",
        "perizinan usaha",
        "akses legal",
        "yayasan",
        "koperasi",
        "PKP",
    ],
    openGraph: {
        title: "Katalog Layanan Lengkap - Akses Legal Indonesia",
        description:
            "Pilih solusi legalitas yang sesuai dengan kebutuhan skala bisnis Anda. Pendirian PT, CV, Yayasan, HAKI dengan harga transparan.",
        type: "website",
        locale: "id_ID",
        siteName: "Akses Legal Indonesia",
    },
};

export default function LayananLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
