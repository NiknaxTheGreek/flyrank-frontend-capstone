"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

const items = [
  { label: "Overview", content: "Explore the accessibility playground." },
  { label: "Keyboard", content: "Use Left and Right arrows to switch tabs. Home selects the first; End selects the last." },
  { label: "About", content: "Built with React and TypeScript without a component library." },
];

export default function Tabs() {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;

    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % items.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + items.length) % items.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Playground information" className="flex gap-2">
        {items.map((item, index) => (
          <button
            key={item.label}
            ref={(element) => { buttons.current[index] = element; }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded px-4 py-3 font-semibold
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-4 focus-visible:outline-sky-300
              ${selected === index ? "bg-sky-300 text-slate-950" : "bg-slate-700 text-white"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.map((item, index) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={selected !== index}
          tabIndex={0}
          className="mt-4 rounded border border-slate-400 p-4
                     focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-offset-4 focus-visible:outline-sky-300"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
