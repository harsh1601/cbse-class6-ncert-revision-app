"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardList, FileText, Home, LineChart, Map, MessageCircleQuestion } from "lucide-react";
import { VisitorCounter } from "@/components/VisitorCounter";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/chapters", label: "Chapters", icon: Map },
  { href: "/test-builder", label: "Test Builder", icon: FileText },
  { href: "/chat-tutor", label: "Chat Tutor", icon: MessageCircleQuestion },
  { href: "/progress", label: "Progress", icon: LineChart },
];

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-lagoon via-moss to-plum text-white shadow-sm">
              <BookOpen size={20} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-moss">CBSE Class 6</span>
              <span className="block truncate text-lg font-bold leading-tight">NCERT Revision App</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <VisitorCounter />
            <nav className="flex items-center gap-1" aria-label="Primary navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                      active ? "bg-gradient-to-r from-lagoon to-moss text-white" : "text-stone-700 hover:bg-sky-50"
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-stone-200 bg-paper sm:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${
                active ? "text-lagoon" : "text-stone-600"
              }`}
            >
              <Icon size={19} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="h-16 sm:hidden" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-stone-100 text-moss">
        {icon ?? <ClipboardList size={18} aria-hidden="true" />}
      </div>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200" aria-label={label} aria-valuenow={normalized} role="progressbar">
        <div className="h-full rounded-full bg-moss transition-all" style={{ width: `${normalized}%` }} />
      </div>
      {label ? <p className="mt-1 text-xs font-semibold text-stone-500">{label}</p> : null}
    </div>
  );
}
