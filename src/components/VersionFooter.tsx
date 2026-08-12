"use client";

import { useSyncExternalStore } from "react";

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
}

const emptySubscribe = () => () => {};

// useSyncExternalStore liefert auf dem Server null und im Browser das Datum –
// so bleiben Server- und Client-HTML beim Hydrieren identisch.
export function VersionFooter() {
  const date = useSyncExternalStore(
    emptySubscribe,
    () => formatDate(new Date()),
    () => null,
  );

  return (
    <footer className="fixed bottom-0 w-full p-3 text-center text-xs text-neutral-400">
      Automatisch entwickelt mit Claude{date ? ` – Stand: ${date}` : ""}
    </footer>
  );
}
