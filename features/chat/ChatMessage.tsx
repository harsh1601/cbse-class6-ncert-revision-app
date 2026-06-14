"use client";

import { Bot, UserRound } from "lucide-react";
import type { ChatTutorMessage } from "@/features/chat/types";

function MessageText({ content }: { content: string }) {
  return (
    <div className="space-y-2">
      {content.split("\n").map((line, index) => (
        <p key={`${line}-${index}`} className={line.endsWith(":") ? "font-bold" : undefined}>
          {line || "\u00a0"}
        </p>
      ))}
    </div>
  );
}

export function ChatMessage({ message }: { message: ChatTutorMessage }) {
  const isStudent = message.role === "student";
  const Icon = isStudent ? UserRound : Bot;

  return (
    <article className={`flex gap-3 ${isStudent ? "justify-end" : "justify-start"}`}>
      {!isStudent ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-lagoon to-moss text-white shadow-sm">
          <Icon size={18} aria-hidden="true" />
        </span>
      ) : null}
      <div
        className={`max-w-[88%] rounded-lg border px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%] ${
          isStudent ? "border-plum/20 bg-plum text-white" : "border-sky-100 bg-white text-stone-700"
        }`}
      >
        <p className={`mb-1 text-xs font-black uppercase tracking-[0.14em] ${isStudent ? "text-white/75" : "text-lagoon"}`}>{isStudent ? "Student" : "Chat Tutor"}</p>
        <MessageText content={message.content} />
      </div>
      {isStudent ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-plum text-white shadow-sm">
          <Icon size={18} aria-hidden="true" />
        </span>
      ) : null}
    </article>
  );
}

