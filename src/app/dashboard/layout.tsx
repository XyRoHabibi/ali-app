import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Digital Dashboard - PT Akses Legal Indonesia",
    description:
        "Pantau proses legalitas bisnis Anda secara real-time. Dashboard digital untuk tracking permohonan, dokumen legal, dan billing.",
    keywords: [
        "dashboard legalitas",
        "tracking dokumen legal",
        "permohonan PT",
        "monitoring bisnis",
        "akses legal dashboard",
    ],
    openGraph: {
        title: "Digital Dashboard - PT Akses Legal Indonesia",
        description:
            "Pantau proses legalitas bisnis Anda secara real-time.",
        type: "website",
        locale: "id_ID",
        siteName: "Akses Legal Indonesia",
    },
};

// Dashboard has its own layout without the main Header and Footer
import DashboardShell from "./components/DashboardShell";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell>{children}</DashboardShell>;
}
