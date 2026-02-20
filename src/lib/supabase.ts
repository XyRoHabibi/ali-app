import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Admin client (for server-side operations with full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
});

// Bucket names
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
