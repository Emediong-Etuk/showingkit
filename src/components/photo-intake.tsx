import { ImagePlus } from "lucide-react";
import { useId, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

export function PhotoIntake({
  label,
  hint,
  busy,
  onFiles,
}: {
  label: string;
  hint?: string;
  busy?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const id = useId();
  const [over, setOver] = useState(false);

  function take(list: FileList | File[] | null) {
    if (!list || busy) return;
    const files = Array.from(list);
    if (files.length) onFiles(files);
  }

  function onDrag(e: DragEvent<HTMLLabelElement>, next: boolean) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragleave" && e.currentTarget.contains(e.relatedTarget as Node)) return;
    setOver(next);
  }

  return (
    <label
      htmlFor={id}
      onDragEnter={(e) => onDrag(e, true)}
      onDragOver={(e) => onDrag(e, true)}
      onDragLeave={(e) => onDrag(e, false)}
      onDrop={(e) => {
        onDrag(e, false);
        take(e.dataTransfer.files);
      }}
      className={cn(
        "relative block cursor-pointer rounded-xl bg-paper-dark px-4 py-5 transition-colors duration-150",
        over && "bg-paper-deep",
        busy && "pointer-events-none opacity-70",
      )}
    >
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        className="photo-intake-input"
        disabled={busy}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
      <span className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-paper text-copper shadow-[var(--shadow-paper)]">
          <ImagePlus className="size-5" strokeWidth={1.75} />
        </span>
        <span>
          <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-copper">
            {busy ? "Developing stills" : label}
          </span>
          <span className="mt-1 block text-sm text-ink-soft">
            {busy
              ? "Compressing so they survive a reload."
              : (hint ?? "Drop stills on this tray, or tap to open the roll.")}
          </span>
        </span>
      </span>
    </label>
  );
}
