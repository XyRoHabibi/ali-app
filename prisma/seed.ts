import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.SUPER_ADMIN_EMAIL || "admin@akseslegal.co.id";
    const password = process.env.SUPER_ADMIN_PASSWORD || "admin12345";
    const name = "Super Admin";

    // Check if super admin already exists
    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        console.log(`Super admin already exists: ${email}`);
        // Update role if not already SUPER_ADMIN
        if (existing.role !== "SUPER_ADMIN") {
            await prisma.user.update({
                where: { email },
                data: { role: "SUPER_ADMIN" },
            });
            console.log("Updated role to SUPER_ADMIN");
        }
        return;
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "SUPER_ADMIN",
        },
    });

    console.log(`Super admin created: ${email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
