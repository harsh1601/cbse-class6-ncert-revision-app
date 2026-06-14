"use client";

import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import { readProfile } from "@/lib/progress";

type VisitorResponse = {
  configured: boolean;
  visitorCount: number | null;
};

const sessionStorageKey = "class6-ncert-visitor-session-id";
const loggedStorageKey = "class6-ncert-visitor-logged";

function getVisitorSessionId() {
  const existing = window.sessionStorage.getItem(sessionStorageKey);

  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  window.sessionStorage.setItem(sessionStorageKey, sessionId);
  return sessionId;
}

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let active = true;

    async function recordVisit() {
      const sessionId = getVisitorSessionId();
      const alreadyLogged = window.sessionStorage.getItem(loggedStorageKey) === sessionId;
      const profile = readProfile();
      const method = alreadyLogged ? "GET" : "POST";

      if (method === "POST") {
        window.sessionStorage.setItem(loggedStorageKey, sessionId);
      }

      const response = await fetch("/api/visitors", {
        method,
        headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
        body: method === "POST" ? JSON.stringify({ sessionId, visitorName: profile?.name ?? "Student" }) : undefined,
        cache: "no-store",
      });

      if (!response.ok) {
        if (method === "POST") {
          window.sessionStorage.removeItem(loggedStorageKey);
        }
        return;
      }

      const data = (await response.json()) as VisitorResponse;

      if (!active) {
        return;
      }

      setConfigured(data.configured);
      setVisitorCount(data.visitorCount);

      if (method === "POST" && !data.configured) {
        window.sessionStorage.removeItem(loggedStorageKey);
      }
    }

    recordVisit().catch(() => {
      if (active) {
        setVisitorCount(null);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="hidden items-center gap-2 rounded-md border border-sky-100 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-sm md:inline-flex">
      <UsersRound size={15} className="text-lagoon" aria-hidden="true" />
      <span>Visitors</span>
      <span className="rounded bg-sky-50 px-1.5 py-0.5 text-lagoon">{configured && visitorCount !== null ? visitorCount.toLocaleString("en-IN") : "--"}</span>
    </div>
  );
}
