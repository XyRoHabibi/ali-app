import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tentang Kami - PT Akses Legal Indonesia",
    description:
        "PT Akses Legal Indonesia adalah partner strategis bagi ribuan pengusaha dalam mengamankan pondasi legal bisnis mereka melalui teknologi. Visi, Misi, dan Tim Ahli kami.",
    keywords: [
        "tentang akses legal",
        "profil perusahaan",
        "visi misi akses legal",
        "tim ahli hukum",
        "partner legalitas bisnis",
        "layanan hukum UMKM",
    ],
    openGraph: {
        title: "Tentang Kami - PT Akses Legal Indonesia",
        description:
            "Partner strategis bagi ribuan pengusaha dalam mengamankan pondasi legal bisnis mereka.",
        type: "website",
        locale: "id_ID",
        siteName: "Akses Legal Indonesia",
    },
};

export default function TentangLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
