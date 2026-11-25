"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function Modal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-offset-4 focus-visible:outline-sky-300";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded bg-sky-300 px-4 py-3 font-semibold text-slate-950 ${focusStyle}`}
      >
        Open demo modal
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        aria-modal="true"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;

          const dialog = dialogRef.current;
          if (!dialog) return;

          const controls = Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
            )
          ).filter((element) => element.getClientRects().length > 0);

          const first = controls[0];
          const last = controls[controls.length - 1];

          if (!first || !last) {
            event.preventDefault();
            return;
          }

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl
                   border border-slate-400 bg-slate-900 p-6 text-white
                   backdrop:bg-black/70"
      >
        <h2 id={`${id}-title`} className="text-2xl font-bold">
          Keyboard-friendly modal
        </h2>
        <p id={`${id}-description`} className="mt-3">
          Focus stays inside this window. Press Escape or use either
          button to close it.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className={`rounded border border-slate-400 px-4 py-2 ${focusStyle}`}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`rounded bg-sky-300 px-4 py-2 text-slate-950 ${focusStyle}`}
          >
            Done
          </button>
        </div>
      </dialog>
    </>
  );
}
