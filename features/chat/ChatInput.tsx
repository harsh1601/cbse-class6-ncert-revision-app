"use client";

import { SendHorizontal } from "lucide-react";

export function ChatInput({
  value,
  loading,
  onChange,
  onSubmit,
}: {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="grid gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-[1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={2}
        maxLength={600}
        className="max-h-32 min-h-14 w-full resize-y rounded-md border border-stone-300 bg-[#fbfaf6] px-3 py-3 text-sm outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15"
        placeholder="Ask your doubt, for example: Explain fractions"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        <SendHorizontal size={17} aria-hidden="true" />
        Send
      </button>
    </form>
  );
}

