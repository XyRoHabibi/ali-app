import fs from "fs";
import path from "path";

// Base upload directory (relative to project root)
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Bucket directories (replaces Supabase buckets)
export const BUCKET_LEGAL_DOCS = "legal-docs";
export const BUCKET_USER_VAULT = "user-vault";

// Allowed file types
export const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Max file size per upload (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Default storage limit (50MB)
export const DEFAULT_STORAGE_LIMIT = 52428800;

export function getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "";
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Ensure that the directory for the given bucket and file path exists
 */
function ensureDir(bucket: string, filePath: string): void {
    const fullDir = path.join(UPLOAD_DIR, bucket, path.dirname(filePath));
    fs.mkdirSync(fullDir, { recursive: true });
}

/**
 * Upload a file to local storage
 * @returns The relative path within the bucket (used for URL generation)
 */
export async function uploadFile(
    bucket: string,
    filePath: string,
    data: ArrayBuffer | Buffer,
    _contentType?: string
): Promise<{ error: Error | null }> {
    try {
        ensureDir(bucket, filePath);
        const fullPath = path.join(UPLOAD_DIR, bucket, filePath);
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        fs.writeFileSync(fullPath, buffer);
        return { error: null };
    } catch (err) {
        return { error: err as Error };
    }
}

/**
 * Delete file(s) from local storage
 */
export async function removeFiles(
    bucket: string,
    filePaths: string[]
): Promise<void> {
    for (const filePath of filePaths) {
        const fullPath = path.join(UPLOAD_DIR, bucket, filePath);
        try {
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        } catch (err) {
            console.error(`Failed to delete file ${fullPath}:`, err);
        }
    }
}

/**
 * Get the public URL for a file stored locally.
 * This generates a URL pointing to our own API route that serves the file.
 */
export function getPublicUrl(bucket: string, filePath: string): string {
    // Encode each path segment to handle special characters
    const encodedPath = filePath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
    return `/api/uploads/${bucket}/${encodedPath}`;
}

/**
 * Get the absolute file path on disk for a given bucket and file path
 */
export function getFilePath(bucket: string, filePath: string): string {
    return path.join(UPLOAD_DIR, bucket, filePath);
}

/**
 * Extract the relative file path from a local public URL
 * e.g. /api/uploads/user-vault/abc/file.png -> abc/file.png
 */
export function extractPathFromUrl(
    url: string,
    bucket: string
): string | null {
    const prefix = `/api/uploads/${bucket}/`;
    if (url.startsWith(prefix)) {
        return decodeURIComponent(url.substring(prefix.length));
    }
    // Also handle old Supabase URLs for backward compatibility
    const supabasePrefix = `${bucket}/`;
    const idx = url.indexOf(supabasePrefix);
    if (idx !== -1) {
        return decodeURIComponent(url.substring(idx + supabasePrefix.length));
    }
    return null;
}
