"use client";

import type { ReactNode } from "react";
import { Button } from "./button";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4"
      role="dialog"
    >
      <section className="w-full max-w-lg rounded-3xl bg-white p-6 text-slate-950 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black">{title}</h2>
          <Button className="text-slate-950 hover:bg-slate-100" onClick={onClose} variant="ghost">
            بستن
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
