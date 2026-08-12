"use client";

import { useEffect, useState } from "react";

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
}

// Datum erst nach dem Mount setzen, damit Server- und Client-HTML
// beim Hydrieren identisch sind.
export function VersionFooter() {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    setDate(formatDate(new Date()));
  }, []);

  return (
    <footer className="fixed bottom-0 w-full p-3 text-center text-xs text-neutral-400">
      Automatisch entwickelt mit Claude{date ? ` – Stand: ${date}` : ""}
    </footer>
  );
}
