import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "./components/AdminShell";

export const metadata: Metadata = {
    title: "Super Admin Panel - PT Akses Legal Indonesia",
    description:
        "Panel administrasi untuk mengelola pengguna dan sistem PT Akses Legal Indonesia.",
};

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    return <AdminShell user={session.user}>{children}</AdminShell>;
}
