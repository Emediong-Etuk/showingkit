import type { EvidencePhoto } from "./types";
import { nowIso, uid } from "./utils";

const MAX_EDGE = 1100;
const JPEG_QUALITY = 0.68;
const MAX_FILES = 12;

/**
 * Demo stills are bundled (src/assets/photos) so a clone does not depend on
 * /public/photos being present, and persisted `.jpg` seed paths still resolve.
 */
const bundled = import.meta.glob("../assets/photos/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const STILLS_BY_STEM: Record<string, string> = {};
for (const [path, url] of Object.entries(bundled)) {
  const file = path.split("/").pop() ?? "";
  STILLS_BY_STEM[file.replace(/\.svg$/i, "")] = url;
}

export function fieldStillSrc(src: string | undefined | null): string {
  if (!src) return "";
  if (/^(data:|blob:|https?:)/i.test(src)) return src;
  const file = (src.split("/").pop() ?? "").split("?")[0];
  const stem = file.replace(/\.(jpe?g|png|webp|gif|svg)$/i, "");
  if (stem && STILLS_BY_STEM[stem]) return STILLS_BY_STEM[stem];
  if (src.startsWith("/photos/")) return src.replace(/\.jpe?g(\?.*)?$/i, ".svg$1");
  return src;
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
