"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenCheck, ClipboardList, FileText, Map, MessageCircleQuestion, Play, Route, Target } from "lucide-react";
import { AppFrame, ProgressBar } from "@/components/AppFrame";
import { SourceBadge } from "@/components/SourceBadge";
import { class6Subjects, getChapterById, getSubjectProgressSummary } from "@/features/biology/content";
import {
  getLatestAttempt,
  getMasteryForChapter,
  getPlannedChapterId,
  getSubjectMastery,
  getWeakConcepts,
  readProfile,
  readProgress,
  type StudentProfile,
  type StudyProgress,
} from "@/lib/progress";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<StudyProgress | null>(null);

  useEffect(() => {
    const storedProfile = readProfile();
    if (!storedProfile) {
      router.replace("/setup");
      return;
    }

    setProfile(storedProfile);
    setProgress(readProgress());
  }, [router]);

  const plannedChapter = useMemo(() => {
    if (!progress) {
      return class6Subjects[0].chapters[0];
    }

    return getChapterById(getPlannedChapterId(progress)) ?? class6Subjects[0].chapters[0];
  }, [progress]);

  const plannedSubject = class6Subjects.find((subject) => subject.id === plannedChapter.subjectId) ?? class6Subjects[0];
  const weakConcepts = progress ? getWeakConcepts(progress).slice(0, 5) : [];
  const latestAttempt = progress ? getLatestAttempt(progress, plannedChapter.id) : undefined;

  if (!profile || !progress) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Opening dashboard</p>
      </main>
    );
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-lg border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-5 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: plannedSubject.accent }}>
                  Today's revision
                </p>
                <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{plannedChapter.title}</h1>
                <p className="mt-2 text-sm font-bold text-stone-500">
                  {plannedSubject.title} - Chapter {plannedChapter.number}
                </p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">{plannedChapter.summary}</p>
              </div>
              <div className="rounded-md bg-[#f4f2ea] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Daily target</p>
                <p className="mt-1 text-2xl font-black text-ink">{profile.dailyMinutes} min</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {["Video", "Summary", "Quick check", "Paper"].map((step, index) => (
                <div key={step} className="rounded-md border border-stone-200 bg-[#fbfaf6] p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">{index + 1}</span>
                  <p className="mt-3 text-sm font-bold">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/learn/${plannedChapter.id}`} className="inline-flex items-center gap-2 rounded-md bg-moss px-4 py-3 text-sm font-bold text-white transition hover:bg-[#2d5745]">
                <Play size={16} aria-hidden="true" />
                Continue revision
              </Link>
              <Link href={`/practice/${plannedChapter.id}`} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-moss">
                <ClipboardList size={16} aria-hidden="true" />
                Practice paper
              </Link>
              <Link href="/chapters" className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-lagoon">
                <Map size={16} aria-hidden="true" />
                All chapters
              </Link>
              <Link href="/test-builder" className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-plum">
                <FileText size={16} aria-hidden="true" />
                Periodic test
              </Link>
              <Link href="/chat-tutor" className="inline-flex items-center gap-2 rounded-md bg-plum px-4 py-3 text-sm font-bold text-white transition hover:bg-[#9333ea]">
                <MessageCircleQuestion size={16} aria-hidden="true" />
                Ask a Doubt
              </Link>
            </div>

            <div className="mt-6">
              <SourceBadge sourceRefIds={plannedChapter.sourceRefIds} />
            </div>
          </div>

          <aside className="rounded-lg border border-stone-200 bg-gradient-to-br from-ink via-[#1d4ed8] to-plum p-5 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f5d8a9]">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold">{profile.name}</h2>
            <div className="mt-6 rounded-md bg-white/10 p-4">
              <p className="text-sm font-semibold">Current chapter score</p>
              <p className="mt-1 text-2xl font-black">{latestAttempt ? `${latestAttempt.score}/${latestAttempt.total}` : "Not attempted"}</p>
            </div>
            <div className="mt-4 rounded-md bg-white/10 p-4">
              <p className="text-sm font-semibold">NCERT books</p>
              <p className="mt-1 text-2xl font-black">{class6Subjects.reduce((total, subject) => total + subject.chapters.length, 0)} chapters</p>
            </div>
          </aside>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Target size={20} className="text-coral" aria-hidden="true" />
              <h2 className="text-xl font-bold">Weak areas</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {weakConcepts.length ? (
                weakConcepts.map((item) => (
                  <div key={item.concept} className="flex items-center justify-between rounded-md border border-stone-200 bg-[#fbfaf6] px-3 py-2 text-sm">
                    <span className="font-semibold">{item.concept}</span>
                    <span className="text-stone-500">{item.count} flag{item.count === 1 ? "" : "s"}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-dashed border-stone-300 bg-[#fbfaf6] p-4 text-sm leading-6 text-stone-600">
                  Weak areas will appear after your first practice paper.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Subject map</p>
                <h2 className="mt-1 text-xl font-bold">Pick a book to revise</h2>
              </div>
              <Link href="/chapters" className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-bold hover:border-moss">
                Open map
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {class6Subjects.map((subject) => {
                const summary = getSubjectProgressSummary(progress, subject.id);
                const mastery = getSubjectMastery(progress, subject.id);

                return (
                  <Link key={subject.id} href={`/chapters?subject=${subject.id}`} className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4 transition hover:border-moss">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold">{subject.title}</p>
                        <p className="text-xs font-semibold text-stone-500">{subject.bookTitle}</p>
                      </div>
                      <BookOpenCheck size={18} style={{ color: subject.accent }} aria-hidden="true" />
                    </div>
                    <p className="mt-3 text-sm text-stone-600">
                      {summary.completed}/{summary.total} lessons complete
                    </p>
                    <div className="mt-3">
                      <ProgressBar value={mastery} label={`${mastery}% mastery`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-purple-100 bg-gradient-to-r from-white via-purple-50 to-amber-50 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-plum text-white">
                <FileText size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-plum">For school tests</p>
                <h2 className="text-xl font-bold">Create periodic-test papers from selected chapters</h2>
                <p className="mt-1 text-sm text-stone-600">Example: Science Ch 1, Ch 3, and Ch 6 only.</p>
              </div>
            </div>
            <Link href="/test-builder" className="inline-flex items-center gap-2 rounded-md bg-plum px-4 py-3 text-sm font-bold text-white hover:bg-[#9333ea]">
              Open builder
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-sky-100 bg-gradient-to-r from-white via-sky-50 to-emerald-50 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-lagoon text-white">
                <MessageCircleQuestion size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-lagoon">Chat Tutor</p>
                <h2 className="text-xl font-bold">Ask a doubt while revising</h2>
                <p className="mt-1 text-sm text-stone-600">Get a Class 6-friendly explanation with examples and a small practice question.</p>
              </div>
            </div>
            <Link href="/chat-tutor" className="inline-flex items-center gap-2 rounded-md bg-lagoon px-4 py-3 text-sm font-bold text-white hover:bg-[#0284c7]">
              Open Chat Tutor
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-plum">Learning path</p>
              <h2 className="mt-1 text-2xl font-bold">Follow the subject-wise study plan</h2>
            </div>
            <Link href="/chapters" className="inline-flex items-center gap-2 rounded-md bg-plum px-4 py-2 text-sm font-bold text-white hover:bg-[#9333ea]">
              Full chapter map
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {class6Subjects.map((subject) => {
              const nextOpenChapter = subject.chapters.find((chapter) => !progress.completedLessons[chapter.id]) ?? subject.chapters[0];
              const pathChapters = subject.chapters.slice(0, 5);

              return (
                <article key={subject.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md text-white" style={{ backgroundColor: subject.accent }}>
                      <Route size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-bold">{subject.title}</h3>
                      <p className="text-xs font-semibold text-stone-500">Next: Chapter {nextOpenChapter.number}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {pathChapters.map((chapter) => {
                      const mastery = getMasteryForChapter(progress, chapter.id);
                      const status = progress.completedLessons[chapter.id] ? "Revised" : mastery > 0 ? "Started" : "Next";

                      return (
                        <Link key={chapter.id} href={`/learn/${chapter.id}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-stone-200 bg-[#fbfaf6] px-3 py-2 hover:border-lagoon">
                          <span className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-black text-white" style={{ backgroundColor: subject.accent }}>
                            {chapter.number}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">{chapter.title}</span>
                            <span className="block text-xs font-semibold text-stone-500">{status}</span>
                          </span>
                          <ArrowRight size={15} className="text-stone-500" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
