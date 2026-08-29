import { cva, type VariantProps } from "class-variance-authority";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none font-body",
  {
    variants: {
      variant: {
        copper:
          "bg-copper text-cream hover:bg-copper-dark active:bg-copper-dark shadow-[0_1px_0_rgba(28,25,22,0.2)]",
        ink: "bg-ink text-paper hover:brightness-90 active:brightness-90",
        ghost: "bg-transparent text-ink hover:bg-paper-deep active:bg-paper-deep",
        outline:
          "bg-transparent text-ink shadow-[0_0_0_1px_rgba(28,25,22,0.22)] hover:bg-paper-deep hover:shadow-[0_0_0_1px_rgba(28,25,22,0.38)] active:bg-paper-deep",
        danger: "bg-danger text-cream hover:brightness-90 active:brightness-90",
        clear: "bg-clear text-cream hover:brightness-90 active:brightness-90",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-11 px-4 text-base rounded-md",
        lg: "h-12 px-5 text-lg rounded-lg",
      },
    },
    defaultVariants: { variant: "copper", size: "md" },
  },
);

export function chipClass(on: boolean, className?: string) {
  return cn(
    "rounded-full px-3 py-2 text-sm transition-colors duration-150",
    on ? "bg-ink text-paper hover:brightness-90" : "bg-paper-dark text-ink hover:bg-paper-deep",
    className,
  );
}

export function pillClass(on: boolean, className?: string) {
  return cn(
    "rounded-md transition-colors duration-150",
    on ? "bg-ink text-paper hover:brightness-90" : "bg-paper-dark text-ink hover:bg-paper-deep",
    className,
  );
}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md bg-paper px-3 text-ink shadow-[0_0_0_1px_rgba(28,25,22,0.18)] placeholder:text-muted transition-colors duration-150 hover:bg-paper-dark focus:bg-paper focus:shadow-[0_0_0_2px_var(--color-copper)]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-lg bg-paper px-3 py-2 text-ink shadow-[0_0_0_1px_rgba(28,25,22,0.18)] placeholder:text-muted transition-colors duration-150 hover:bg-paper-dark focus:bg-paper focus:shadow-[0_0_0_2px_var(--color-copper)]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block font-mono text-[11px] uppercase tracking-[0.14em] text-muted", className)}
      {...props}
    />
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
