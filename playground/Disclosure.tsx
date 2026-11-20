"use client";

import { useId, useState, type ReactNode } from "react";

type DisclosureProps = {
  title: string;
  children: ReactNode;
};

export default function Disclosure({
  title,
  children,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <section className="rounded-lg border border-slate-300 p-4">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between gap-4 rounded
                   text-left font-semibold
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        <span>{title}</span>
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>

      <div id={panelId} hidden={!isOpen} className="pt-4">
        {children}
      </div>
    </section>
  );
}
