import fs from "fs";
import path from "path";
import heicConvert from "heic-convert";

export const UPLOAD_DIR = path.resolve(__dirname, "..", "uploads");
export const DEFAULT_IMAGE = "/uploads/default-profile-picture.jpg";
export const LOGO_IMAGE = "/uploads/logo.png";

function isHeicFile(ext: string, mime: string) {
  return ext === ".heic" || ext === ".heif" || mime === "image/heic" || mime === "image/heif";
}

function makeFileName(ext: string) {
  const rand = Math.random().toString(16).slice(2);
  return `${Date.now()}_${rand}${ext}`;
}

export async function saveImage(buffer?: Buffer, originalName?: string, mimetype?: string) {
  if (!buffer || !originalName) return DEFAULT_IMAGE;

  const ext = path.extname(originalName).toLowerCase();
  const mime = (mimetype ?? "").toLowerCase();
  const isHeic = isHeicFile(ext, mime);

  if (isHeic) {
    const out = await heicConvert({
      buffer,
      format: "JPEG",
      quality: 1,
    });

    const filename = makeFileName(".jpg");
    const fullPath = path.join(UPLOAD_DIR, filename);
    await fs.promises.writeFile(fullPath, out as Buffer);

    return `/uploads/${filename}`;
  }

  const normalizedExt = ext === ".jpeg" ? ".jpg" : ext;
  const filename = makeFileName(normalizedExt);
  const fullPath = path.join(UPLOAD_DIR, filename);
  await fs.promises.writeFile(fullPath, buffer);

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
