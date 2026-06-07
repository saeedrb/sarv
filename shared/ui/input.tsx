import type { ComponentProps } from "react";
import { cn } from "@/shared/utils";

type InputProps = ComponentProps<"input"> & {
  error?: string;
  label?: string;
};

export function Input({ className, error, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-2" htmlFor={inputId}>
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        aria-invalid={Boolean(error)}
        className={cn(
          "rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/30",
          className,
        )}
        id={inputId}
        {...props}
      />
      {error ? <span className="text-sm text-red-500">{error}</span> : null}
    </label>
  );
}
