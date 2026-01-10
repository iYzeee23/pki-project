import fs from "fs";
import path from "path";

export const UPLOAD_DIR = path.resolve(__dirname, "..", "uploads");
export const DEFAULT_IMAGE = "/uploads/default-profile-picture.jpg";

export function saveImage(buffer?: Buffer, originalName?: string): string {
    if (!buffer || !originalName) return DEFAULT_IMAGE;

    const ext = path.extname(originalName);
    const filename = `${Date.now()}${ext}`;
    const fullPath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(fullPath, buffer);

    return `/uploads/${filename}`;
}

export function readImage(publicPath: string): Buffer {
  if (!publicPath.startsWith("/uploads/")) throw new Error("Invalid image path");

  const filename = publicPath.replace("/uploads/", "");
  const fullPath = path.join(UPLOAD_DIR, filename);

  return fs.readFileSync(fullPath);
}

export function deleteImage(publicPath: string): void {
  if (!publicPath.startsWith("/uploads/")) return;
  if (publicPath === DEFAULT_IMAGE) return;

  const filename = publicPath.replace("/uploads/", "");
  const fullPath = path.join(UPLOAD_DIR, filename);

  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}
