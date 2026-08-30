import type { EvidencePhoto } from "./types";
import { nowIso, uid } from "./utils";

const MAX_EDGE = 1100;
const JPEG_QUALITY = 0.68;
const MAX_FILES = 12;

/**
 * Demo stills in this kit ship as SVG (Git-friendly). Older seed data and
 * persisted showings still ask for `.jpg` — rewrite those public paths so
 * polaroids and listing thumbs never 404.
 */
export function fieldStillSrc(src: string | undefined | null): string {
  if (!src) return "";
  if (!src.startsWith("/photos/")) return src;
  return src.replace(/\.jpe?g(\?.*)?$/i, ".svg$1");
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read still"));
    reader.readAsDataURL(file);
  });
}

function captionFromName(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

export async function fileToStoredSrc(file: File): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return readAsDataUrl(file);
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } catch {
    return readAsDataUrl(file);
  }
}

export async function filesToPhotos(
  files: File[],
  source: EvidencePhoto["source"],
): Promise<EvidencePhoto[]> {
  const picked = files
    .filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|heic)$/i.test(f.name))
    .slice(0, MAX_FILES);
  const photos: EvidencePhoto[] = [];
  for (const file of picked) {
    photos.push({
      id: uid(source === "listing" ? "lp" : "vp"),
      src: await fileToStoredSrc(file),
      caption: captionFromName(file.name),
      kind: source,
      source,
      createdAt: nowIso(),
    });
  }
  return photos;
}
