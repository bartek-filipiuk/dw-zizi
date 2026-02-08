import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export interface UploadResult {
  url: string;
  width: number;
  height: number;
  filename: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, AVIF");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 10MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const filename = `${randomUUID()}.webp`;
  const subdir = new Date().toISOString().slice(0, 7); // e.g. "2026-02"
  const dirPath = path.join(UPLOAD_DIR, subdir);

  await mkdir(dirPath, { recursive: true });

  const outputPath = path.join(dirPath, filename);

  await image
    .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath);

  return {
    url: `/api/uploads/${subdir}/${filename}`,
    width: metadata.width || 0,
    height: metadata.height || 0,
    filename,
  };
}

export async function deleteImage(url: string): Promise<void> {
  const relativePath = url.replace("/api/uploads/", "");
  const fullPath = path.join(UPLOAD_DIR, relativePath);
  try {
    await unlink(fullPath);
  } catch {
    // File might not exist, ignore
  }
}

export async function copyLocalImage(
  sourcePath: string,
  targetFilename: string
): Promise<UploadResult> {
  const image = sharp(sourcePath);
  const metadata = await image.metadata();

  const subdir = "seed";
  const dirPath = path.join(UPLOAD_DIR, subdir);
  await mkdir(dirPath, { recursive: true });

  const outputPath = path.join(dirPath, targetFilename);

  await writeFile(outputPath, await image.toBuffer());

  return {
    url: `/api/uploads/${subdir}/${targetFilename}`,
    width: metadata.width || 0,
    height: metadata.height || 0,
    filename: targetFilename,
  };
}
