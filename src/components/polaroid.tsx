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
  return (
    <figure
      className={cn("relative bg-cream p-2 pb-8 text-night shadow-[var(--shadow-paper)]", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="tape -top-2 left-3 -rotate-12" />
      <span className="tape -top-1 right-4 rotate-[18deg]" />
      <img src={src} alt={alt} className="field-photo aspect-[3/4] w-full object-cover" />
      {caption ? (
        <figcaption className="absolute inset-x-2 bottom-2 font-mono text-[10px] tracking-wide text-night/70">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
