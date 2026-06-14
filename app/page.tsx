"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { readProfile } from "@/lib/progress";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(readProfile() ? "/dashboard" : "/setup");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-ink text-white">
          <BookOpen size={26} aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-moss">Opening Class 6 app</p>
        <h1 className="mt-2 text-2xl font-bold">CBSE NCERT Revision</h1>
      </div>
    </main>
  );
}
