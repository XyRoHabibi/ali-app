import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const filePath = resolvedParams.path.map(decodeURIComponent).join("/");
        const absolutePath = path.join(UPLOAD_DIR, filePath);

        // Security: prevent directory traversal
        const normalizedPath = path.resolve(absolutePath);
        if (!normalizedPath.startsWith(UPLOAD_DIR)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!fs.existsSync(normalizedPath)) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        const stat = fs.statSync(normalizedPath);
        if (!stat.isFile()) {
            return NextResponse.json(
                { error: "Not a file" },
                { status: 400 }
            );
        }

        const fileBuffer = fs.readFileSync(normalizedPath);
        const contentType =
            mime.lookup(normalizedPath) || "application/octet-stream";

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": stat.size.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("File serve error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
