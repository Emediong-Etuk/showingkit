import { useState } from "react";
import { fieldStillSrc } from "@/lib/photos";
import { cn } from "@/lib/utils";

export function Polaroid({
  src,
  alt,
  caption,
  className,
  rotate = -2,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  rotate?: number;
}) {
  const [broken, setBroken] = useState(false);
  const resolved = fieldStillSrc(src);
  return (
    <figure
      className={cn("relative bg-cream p-2 pb-8 text-night shadow-[var(--shadow-paper)]", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="tape -top-2 left-3 -rotate-12" />
      <span className="tape -top-1 right-4 rotate-[18deg]" />
      {broken || !resolved ? (
        <div className="field-photo grid aspect-[3/4] w-full place-items-center bg-paper-deep px-3 text-center font-mono text-[10px] uppercase tracking-wider text-muted">
          {caption || alt}
        </div>
      ) : (
        <img
          src={resolved}
          alt={alt}
          className="field-photo aspect-[3/4] w-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
      {caption ? (
        <figcaption className="absolute inset-x-2 bottom-2 font-mono text-[10px] tracking-wide text-night/70">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Square listing thumb that maps seed jpg/svg paths onto bundled stills. */
export function FieldStill({
  src,
  alt = "",
  className,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const resolved = fieldStillSrc(src);
  if (!resolved || broken) {
    return (
      <div
        className={cn(
          "field-photo grid size-24 shrink-0 place-items-center bg-paper-deep font-mono text-[10px] uppercase tracking-wider text-muted",
          className,
        )}
      >
        {alt || "still"}
      </div>
    );
  }
  return (
    <img
      src={resolved}
      alt={alt}
      className={cn("field-photo size-24 shrink-0 object-cover bg-paper-deep", className)}
      onError={() => setBroken(true)}
    />
  );
}
