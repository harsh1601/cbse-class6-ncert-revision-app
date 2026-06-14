"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardList, Lightbulb, ListChecks, MessageCircleQuestion, NotebookTabs, PlayCircle } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { SourceBadge } from "@/components/SourceBadge";
import { TopicGame } from "@/components/TopicGame";
import { allChapters, class6Subjects, getQuestionPapers, type Chapter } from "@/features/biology/content";
import { markLessonComplete, readProfile, readProgress } from "@/lib/progress";

export function LearnClient({ chapter }: { chapter: Chapter }) {
  const router = useRouter();
  const [lessonDone, setLessonDone] = useState(false);

  useEffect(() => {
    if (!readProfile()) {
      router.replace("/setup");
      return;
    }

    const progress = readProgress();
    setLessonDone(Boolean(progress.completedLessons[chapter.id]));
  }, [router, chapter.id]);

  function completeLesson() {
    markLessonComplete(chapter.id);
    setLessonDone(true);
  }

  const subject = class6Subjects.find((item) => item.id === chapter.subjectId) ?? class6Subjects[0];
  const nextChapter = useMemo(() => {
    const chapterIndex = allChapters.findIndex((item) => item.id === chapter.id);
    return allChapters[chapterIndex + 1] ?? allChapters[0];
  }, [chapter.id]);
  const papers = getQuestionPapers(chapter);
  const paperQuestionCount = chapter.subjectId === "maths" ? 30 : 37;
  const paperFormatText =
    chapter.subjectId === "maths"
      ? "Maths papers focus on MCQs plus practical questions with step-by-step working."
      : "Objective sections are auto-checked; written answers show key points and model answers.";

  return (
    <AppFrame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: subject.accent }}>
              {subject.title} - Chapter {String(chapter.number).padStart(2, "0")}
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{chapter.title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-stone-600">{chapter.summary}</p>
          </div>
          <div className="self-start rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-stone-700">Official references</p>
            <div className="mt-3">
              <SourceBadge sourceRefIds={chapter.sourceRefIds} />
            </div>
            <Link href={`/chat-tutor?chapter=${chapter.id}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lagoon px-3 py-2 text-sm font-bold text-white transition hover:bg-[#0284c7]">
              <MessageCircleQuestion size={16} aria-hidden="true" />
              Ask a Doubt
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.72fr]">
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-ink shadow-soft">
            <div className="flex min-h-[280px] flex-col justify-between p-5 text-white sm:min-h-[340px]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f5d8a9]">Revision video</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold">{chapter.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-200">
                  Video slot for an NCERT-aligned lesson. Use the search link to attach a teacher-approved video, or revise from the summary below.
                </p>
              </div>
              <a
                href={chapter.videoSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-[#f5d8a9]"
              >
                <PlayCircle size={17} aria-hidden="true" />
                Find revision video
              </a>
            </div>
          </div>

          <aside id="notes" className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-coral text-white">
                <NotebookTabs size={19} aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold">Revision focus</h2>
            </div>

            <ul className="mt-4 grid gap-2">
              {chapter.focus.map((point) => (
                <li key={point} className="rounded-md bg-[#fbfaf6] px-3 py-2 text-sm leading-6 text-stone-700">
                  {point}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={completeLesson}
              className={`mt-5 inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition ${
                lessonDone ? "bg-stone-200 text-stone-700" : "bg-moss text-white hover:bg-[#2d5745]"
              }`}
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              {lessonDone ? "Chapter marked revised" : "Mark chapter revised"}
            </button>
          </aside>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-moss text-white">
                <Lightbulb size={19} aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold">Chapter summary</h2>
            </div>
            <p className="mt-4 text-base leading-7 text-stone-700">{chapter.summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {chapter.terms.map((term) => (
                <div key={term.term} className="rounded-md border border-stone-200 bg-[#fbfaf6] p-3">
                  <p className="font-bold">{term.term}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{term.meaning}</p>
                  <p className="mt-2 text-xs font-semibold text-stone-500">Example: {term.example}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-lagoon text-white">
                <ListChecks size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Practice papers</h2>
                <p className="text-sm leading-6 text-stone-600">
                  {papers.length} paper{papers.length === 1 ? "" : "s"} are ready for this chapter.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {papers.map((paper) => (
                <Link key={paper.id} href={`/practice/${chapter.id}?paper=${paper.setNumber}`} className="flex items-center justify-between rounded-md border border-stone-200 bg-[#fbfaf6] px-3 py-3 text-sm font-bold hover:border-moss">
                  <span>{paper.title}</span>
                  <span className="text-stone-500">{paperQuestionCount} questions</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6">
          <TopicGame chapter={chapter} />
        </div>

        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
                <ClipboardList size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-bold">Ready for the full paper?</h2>
                <p className="text-sm leading-6 text-stone-600">{paperFormatText}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/practice/${chapter.id}`} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-moss">
                Start paper
              </Link>
              <Link href={`/chat-tutor?chapter=${chapter.id}`} className="inline-flex items-center gap-2 rounded-md bg-lagoon px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0284c7]">
                <MessageCircleQuestion size={16} aria-hidden="true" />
                Ask a Doubt
              </Link>
              <Link href={`/learn/${nextChapter.id}`} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 hover:border-moss">
                Next chapter
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
