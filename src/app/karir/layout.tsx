import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Karir - PT Akses Legal Indonesia | Bergabunglah Bersama Kami",
    description:
        "Bergabunglah dengan tim Akses Legal Indonesia. Temukan peluang karir menarik di bidang legal tech dan jadilah bagian dari transformasi layanan hukum di Indonesia.",
    keywords: [
        "karir akses legal",
        "lowongan kerja legal",
        "legal consultant",
        "digital marketing",
        "frontend developer",
        "customer success",
        "kerja legal tech",
    ],
    openGraph: {
        title: "Karir - PT Akses Legal Indonesia",
        description:
            "Temukan peluang karir menarik di bidang legal tech dan jadilah bagian dari transformasi layanan hukum di Indonesia.",
        type: "website",
        locale: "id_ID",
        siteName: "Akses Legal Indonesia",
    },
};

export default function KarirLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
