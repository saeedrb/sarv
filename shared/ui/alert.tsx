import type { ComponentProps } from "react";
import { cn } from "@/shared/utils";

type AlertVariant = "info" | "success" | "warning" | "danger";

type AlertProps = ComponentProps<"div"> & {
  variant?: AlertVariant;
};

const variants: Record<AlertVariant, string> = {
  info: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  success: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  danger: "border-red-300/30 bg-red-300/10 text-red-100",
};

export function Alert({
  className,
  variant = "info",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn("rounded-2xl border p-4 leading-7", variants[variant], className)}
      role="status"
      {...props}
    />
  );
}
