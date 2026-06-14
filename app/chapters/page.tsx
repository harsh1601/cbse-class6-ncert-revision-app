"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookMarked, ClipboardList, Play, Route } from "lucide-react";
import { AppFrame, ProgressBar } from "@/components/AppFrame";
import { SourceBadge } from "@/components/SourceBadge";
import { class6Subjects, type SubjectId } from "@/features/biology/content";
import { getLatestAttempt, getMasteryForChapter, readProgress, type StudyProgress } from "@/lib/progress";

export default function ChaptersPage() {
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>("science");

  useEffect(() => {
    setProgress(readProgress());
    const querySubject = new URLSearchParams(window.location.search).get("subject");
    if (querySubject === "science" || querySubject === "maths" || querySubject === "sst") {
      setSelectedSubjectId(querySubject);
    }
  }, []);

  const storedProgress = progress ?? { completedLessons: {}, gameScores: {}, attempts: [] };
  const selectedSubject = useMemo(
    () => class6Subjects.find((subject) => subject.id === selectedSubjectId) ?? class6Subjects[0],
    [selectedSubjectId],
  );

  return (
    <AppFrame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Chapter selector</p>
              <h1 className="mt-2 text-3xl font-bold">Class 6 NCERT revision map</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                Choose a subject, revise a chapter, then open the chapter-wise question papers.
              </p>
            </div>
            <SourceBadge sourceRefIds={["ncert-service", "ncert-science", "ncert-maths", "ncert-sst"]} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {class6Subjects.map((subject) => {
              const active = selectedSubjectId === subject.id;

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`rounded-md border px-4 py-2 text-sm font-bold transition ${
                    active ? "border-ink bg-ink text-white" : "border-stone-300 bg-white text-stone-700 hover:border-moss"
                  }`}
                >
                  {subject.title}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: selectedSubject.accent }}>
                {selectedSubject.bookTitle}
              </p>
              <h2 className="mt-1 text-2xl font-bold">{selectedSubject.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{selectedSubject.description}</p>
            </div>
            <a
              href={selectedSubject.ncertUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-bold hover:border-moss"
            >
              NCERT book
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-sky-100 bg-gradient-to-r from-white via-sky-50 to-purple-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md text-white" style={{ backgroundColor: selectedSubject.accent }}>
              <Route size={19} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: selectedSubject.accent }}>
                Learning path
              </p>
              <h2 className="text-xl font-bold">Study {selectedSubject.title} in NCERT order</h2>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {selectedSubject.chapters.map((chapter) => {
              const mastery = getMasteryForChapter(storedProgress, chapter.id);
              const status = storedProgress.completedLessons[chapter.id] ? "Revised" : mastery > 0 ? "Started" : "Open";

              return (
                <Link key={chapter.id} href={`/learn/${chapter.id}`} className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm hover:border-lagoon">
                  <span className="font-black" style={{ color: selectedSubject.accent }}>
                    {String(chapter.number).padStart(2, "0")}
                  </span>
                  <span className="ml-2 font-bold">{chapter.title}</span>
                  <span className="mt-1 block text-xs font-semibold text-stone-500">{status}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-4">
          {selectedSubject.chapters.map((chapter) => {
            const mastery = getMasteryForChapter(storedProgress, chapter.id);
            const latestAttempt = getLatestAttempt(storedProgress, chapter.id);
            const status = mastery >= 80 ? "Strong" : mastery >= 45 ? "Improving" : mastery > 0 ? "Started" : "Open";

            return (
              <article key={chapter.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition hover:border-moss hover:shadow-soft">
                <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-ink text-lg font-black text-white">{String(chapter.number).padStart(2, "0")}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold">{chapter.title}</h3>
                      <span className="rounded-md bg-[#f4f2ea] px-2 py-1 text-xs font-bold text-stone-600">{status}</span>
                      <span className="rounded-md px-2 py-1 text-xs font-bold" style={{ backgroundColor: selectedSubject.softAccent, color: selectedSubject.accent }}>
                        {chapter.theme}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{chapter.summary}</p>
                    <div className="mt-3 max-w-xl">
                      <ProgressBar value={mastery} label={`${mastery}% mastery${latestAttempt ? `, latest paper ${latestAttempt.score}/${latestAttempt.total}` : ""}`} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Link href={`/learn/${chapter.id}`} className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white">
                      <Play size={15} aria-hidden="true" />
                      Revise
                    </Link>
                    <Link href={`/practice/${chapter.id}`} className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:border-moss">
                      <ClipboardList size={15} aria-hidden="true" />
                      Papers
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-lagoon text-white">
                <BookMarked size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-bold">Chapter-wise paper bank</h2>
                <p className="text-sm text-stone-600">Science and SST have 5 papers per chapter with mixed question types. Maths has 10 papers per chapter with 10 MCQs and 20 practical/application questions.</p>
              </div>
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white">
              Dashboard
            </Link>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
