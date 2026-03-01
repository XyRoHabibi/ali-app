import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Providers } from "@/components/providers/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ali-app-dev.vercel.app"),
  title: "Akses Legal Indonesia - Legalitas Bisnis Mudah & Termurah",
  description:
    "Partner legalitas bisnis terpercaya di Indonesia. Membantu UMKM naik kelas dengan proses yang mudah, cepat, dan transparan. Pendirian PT, CV, HAKI, dan perizinan usaha.",
  keywords: [
    "legalitas bisnis",
    "pendirian PT",
    "pendirian CV",
    "PT Perorangan",
    "HAKI",
    "NIB",
    "OSS",
    "Kemenkumham",
    "perizinan usaha",
    "akses legal",
  ],
  authors: [{ name: "PT Akses Legal Indonesia" }],
  openGraph: {
    title: "Akses Legal Indonesia - Legalitas Bisnis Mudah & Termurah",
    description:
      "Partner legalitas bisnis terpercaya di Indonesia. Membantu UMKM naik kelas dengan proses yang mudah, cepat, dan transparan.",
    type: "website",
    locale: "id_ID",
    siteName: "Akses Legal Indonesia",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Akses Legal Indonesia - Legalitas Bisnis Mudah & Termurah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akses Legal Indonesia - Legalitas Bisnis Mudah & Termurah",
    description:
      "Partner legalitas bisnis terpercaya di Indonesia. Pendirian PT, CV, HAKI dengan proses cepat dan harga transparan.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} bg-[#f9fafb] text-[#101519] min-h-screen overflow-x-hidden font-[family-name:var(--font-display)]`}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

