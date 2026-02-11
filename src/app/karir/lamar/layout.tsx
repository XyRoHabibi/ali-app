import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lamar Pekerjaan - PT Akses Legal Indonesia",
    description:
        "Kirimkan lamaran Anda untuk bergabung dengan tim Akses Legal Indonesia. Isi formulir dan upload CV Anda.",
    openGraph: {
        title: "Lamar Pekerjaan - PT Akses Legal Indonesia",
        description:
            "Kirimkan lamaran Anda untuk bergabung dengan tim Akses Legal Indonesia.",
        type: "website",
        locale: "id_ID",
        siteName: "Akses Legal Indonesia",
    },
};

export default function LamarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
