"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Eraser, Lightbulb, Sparkles } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { ChatInput } from "@/features/chat/ChatInput";
import { ChatMessage } from "@/features/chat/ChatMessage";
import type { ChatTutorContext, ChatTutorMessage } from "@/features/chat/types";

const suggestions = [
  "Explain fractions",
  "What is photosynthesis?",
  "I do not understand prime numbers",
  "Explain water cycle in simple words",
  "Give me an example of active and passive voice",
];

function makeMessage(role: ChatTutorMessage["role"], content: string): ChatTutorMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

const welcomeMessage = makeMessage(
  "tutor",
  "Hello! I am your Class 6 Chat Tutor. Ask me any study doubt from Maths, Science, English, Hindi, SST, or revision topics. I will explain it in simple steps.",
);

export function ChatTutorClient({ context }: { context?: ChatTutorContext }) {
  const [messages, setMessages] = useState<ChatTutorMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const historyRef = useRef<HTMLDivElement | null>(null);

  const studentMessages = useMemo(() => messages.filter((message) => message.role === "student"), [messages]);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function askTutor(questionOverride?: string) {
    const question = (questionOverride ?? input).trim();
    if (!question || loading) {
      return;
    }

    const nextMessages = [...messages, makeMessage("student", question)];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          messages: nextMessages.filter((message) => message.role !== "tutor" || message.id !== welcomeMessage.id).slice(-12),
        }),
      });

      if (!response.ok) {
        throw new Error("Chat tutor request failed");
      }

      const data = (await response.json()) as { answer?: string };
      setMessages((current) => [
        ...current,
        makeMessage("tutor", data.answer?.trim() || "Sorry, I am unable to answer right now. Please try again after some time."),
      ]);
    } catch {
      const fallback = "Sorry, I am unable to answer right now. Please try again after some time.";
      setError(fallback);
      setMessages((current) => [...current, makeMessage("tutor", fallback)]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([welcomeMessage]);
    setInput("");
    setError("");
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="overflow-hidden rounded-lg border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-amber-50 shadow-soft">
          <div className="grid gap-5 p-5 lg:grid-cols-[0.72fr_0.28fr] lg:p-6">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-plum">
                <Sparkles size={16} aria-hidden="true" />
                Ask a Doubt
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Chat Tutor for Class 6</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-stone-600">
                Type any doubt and get a simple explanation, an example, key points, and a small practice question.
              </p>
            </div>
            <aside className="rounded-md border border-white/70 bg-white/80 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-lagoon to-moss text-white">
                  <Bot size={19} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold">Session memory</p>
                  <p className="text-xs font-semibold text-stone-500">{studentMessages.length} question{studentMessages.length === 1 ? "" : "s"} asked now</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">The tutor remembers this chat until you clear it or leave the session.</p>
            </aside>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
            <div ref={historyRef} className="max-h-[62vh] min-h-[420px] overflow-y-auto rounded-md bg-[#f8fbff] p-3 sm:p-4">
              <div className="grid gap-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {loading ? (
                  <div className="flex items-center gap-2 rounded-md border border-sky-100 bg-white px-4 py-3 text-sm font-bold text-lagoon shadow-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-lagoon" />
                    Chat Tutor is thinking...
                  </div>
                ) : null}
              </div>
            </div>

            {error ? <p className="mt-3 rounded-md border border-coral/20 bg-coral/5 px-3 py-2 text-sm font-semibold text-coral">{error}</p> : null}

            <div className="mt-4">
              <ChatInput value={input} loading={loading} onChange={setInput} onSubmit={() => askTutor()} />
            </div>
          </div>

          <aside className="grid gap-4 self-start">
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber text-white">
                  <Lightbulb size={18} aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold">Try asking</h2>
              </div>
              <div className="mt-4 grid gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => askTutor(suggestion)}
                    disabled={loading}
                    className="rounded-md border border-stone-200 bg-[#fbfaf6] px-3 py-2 text-left text-sm font-bold text-stone-700 transition hover:border-lagoon disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-coral hover:text-coral"
            >
              <Eraser size={16} aria-hidden="true" />
              Clear chat
            </button>
          </aside>
        </section>
      </div>
    </AppFrame>
  );
}

