"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, RefreshCcw, Target, TrendingUp } from "lucide-react";
import { AppFrame, EmptyState, ProgressBar } from "@/components/AppFrame";
import { class6Subjects } from "@/features/biology/content";
import {
  formatShortDate,
  getAttemptPercent,
  getLatestAttempt,
  getMasteryForChapter,
  getPreviousAttempt,
  getSubjectMastery,
  getWeakConcepts,
  readProfile,
  readProgress,
  resetLocalStudyData,
  type StudentProfile,
  type StudyProgress,
} from "@/lib/progress";

export default function ProgressPage() {
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

  const weakConcepts = useMemo(() => (progress ? getWeakConcepts(progress).slice(0, 10) : []), [progress]);
  const overallMastery = progress
    ? Math.round(class6Subjects.reduce((total, subject) => total + getSubjectMastery(progress, subject.id), 0) / class6Subjects.length)
    : 0;

  function resetData() {
    if (window.confirm("Clear the local student profile and progress on this browser?")) {
      resetLocalStudyData();
      router.push("/setup");
    }
  }

  if (!profile || !progress) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Opening progress</p>
      </main>
    );
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="grid gap-5 lg:grid-cols-[0.7fr_0.3fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Progress</p>
            <h1 className="mt-2 text-3xl font-bold">{profile.name}'s Class 6 map</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
              Mastery combines chapter revision and latest objective practice score. Data stays in this browser.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-ink p-5 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f5d8a9]">Overall mastery</p>
            <p className="mt-3 text-5xl font-black">{overallMastery}%</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-[#f5d8a9]" style={{ width: `${overallMastery}%` }} />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.65fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-lagoon text-white">
                <TrendingUp size={19} aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold">Subject and chapter progress</h2>
            </div>

            <div className="mt-5 grid gap-5">
              {class6Subjects.map((subject) => {
                const mastery = getSubjectMastery(progress, subject.id);

                return (
                  <section key={subject.id} className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.14em]" style={{ color: subject.accent }}>
                          {subject.bookTitle}
                        </p>
                        <h3 className="mt-1 text-xl font-bold">{subject.title}</h3>
                      </div>
                      <span className="rounded-md bg-white px-3 py-2 text-sm font-black">{mastery}%</span>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={mastery} label={`${mastery}% subject mastery`} />
                    </div>

                    <div className="mt-4 grid gap-3">
                      {subject.chapters.map((chapter) => {
                        const chapterMastery = getMasteryForChapter(progress, chapter.id);
                        const latestAttempt = getLatestAttempt(progress, chapter.id);
                        const previousAttempt = getPreviousAttempt(progress, chapter.id);
                        const latestPercent = getAttemptPercent(latestAttempt);
                        const previousPercent = getAttemptPercent(previousAttempt);
                        const improvement = latestAttempt && previousAttempt ? latestPercent - previousPercent : null;

                        return (
                          <div key={chapter.id} className="rounded-md border border-stone-200 bg-white p-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-bold">
                                  {chapter.number}. {chapter.title}
                                </p>
                                <p className="text-sm text-stone-600">
                                  {latestAttempt ? `Paper ${latestAttempt.paperSet}: ${latestAttempt.score}/${latestAttempt.total} on ${formatShortDate(latestAttempt.createdAt)}` : "No practice paper yet"}
                                </p>
                              </div>
                              <Link href={`/practice/${chapter.id}`} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-bold hover:border-moss">
                                Practice
                                <ArrowRight size={15} aria-hidden="true" />
                              </Link>
                            </div>
                            <div className="mt-3">
                              <ProgressBar value={chapterMastery} label={`${chapterMastery}% mastery`} />
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                              <span className="rounded-md bg-[#fbfaf6] px-2 py-1 text-stone-600">Current {latestAttempt ? `${latestPercent}%` : "NA"}</span>
                              <span className="rounded-md bg-[#fbfaf6] px-2 py-1 text-stone-600">Previous {previousAttempt ? `${previousPercent}%` : "NA"}</span>
                              <span className={`rounded-md bg-[#fbfaf6] px-2 py-1 ${improvement === null ? "text-stone-500" : improvement >= 0 ? "text-moss" : "text-coral"}`}>
                                Improvement {improvement === null ? "NA" : `${improvement >= 0 ? "+" : ""}${improvement} pts`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-coral text-white">
                  <Target size={19} aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-bold">Weak areas</h2>
              </div>
              <div className="mt-4 grid gap-2">
                {weakConcepts.length ? (
                  weakConcepts.map((item, index) => (
                    <div key={item.concept} className="flex items-center justify-between rounded-md border border-stone-200 bg-[#fbfaf6] px-3 py-2 text-sm">
                      <span className="font-semibold">
                        {index + 1}. {item.concept}
                      </span>
                      <span className="text-stone-500">{item.count}</span>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No weak areas yet" body="Complete a practice paper to generate targeted revision." />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-stone-700">Local data controls</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">Use this when testing the first-time flow again on the same browser.</p>
              <button type="button" onClick={resetData} className="mt-4 inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:border-coral hover:text-coral">
                <RefreshCcw size={16} aria-hidden="true" />
                Reset local profile
              </button>
            </div>
          </aside>
        </section>
      </div>
    </AppFrame>
  );
}
