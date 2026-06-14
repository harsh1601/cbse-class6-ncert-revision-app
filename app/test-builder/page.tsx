"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, FileText, Search } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { class6Subjects, getSubjectById, type SubjectId } from "@/features/biology/content";
import { downloadSchoolQuestionPaperPdf } from "@/features/practice/pdf";
import { buildPeriodicQuestionPapers, findChaptersForPeriodicTest } from "@/features/practice/periodic";

const examples: Record<SubjectId, string> = {
  science: "1, 3, 6",
  maths: "Fractions, Symmetry, 10",
  sst: "1, 4, Economic Activities",
};

function chapterLine(chapters: ReturnType<typeof findChaptersForPeriodicTest>) {
  return chapters.map((chapter) => `Ch ${chapter.number}: ${chapter.title}`).join(", ");
}

function paperFormatLine(subjectId: SubjectId) {
  return subjectId === "maths" ? "10 MCQ, 20 practical/application questions" : "10 MCQ, 5 matching, 7 true/false, 8 blanks, 5 short, 2 long";
}

export default function TestBuilderPage() {
  const [subjectId, setSubjectId] = useState<SubjectId>("science");
  const [chapterInput, setChapterInput] = useState("1, 3, 6");
  const subject = getSubjectById(subjectId) ?? class6Subjects[0];
  const selectedChapters = useMemo(() => findChaptersForPeriodicTest(subjectId, chapterInput), [chapterInput, subjectId]);
  const papers = useMemo(() => buildPeriodicQuestionPapers(subjectId, selectedChapters, 5), [selectedChapters, subjectId]);

  function switchSubject(nextSubjectId: SubjectId) {
    setSubjectId(nextSubjectId);
    setChapterInput(examples[nextSubjectId]);
  }

  function downloadPaper(setNumber: number) {
    const paper = papers.find((item) => item.setNumber === setNumber);
    if (!paper) {
      return;
    }

    downloadSchoolQuestionPaperPdf(
      {
        title: `${subject.title} Periodic Test`,
        subtitle: chapterLine(selectedChapters),
        sourceLine: `Mixed from selected NCERT chapters only - Sample Paper ${paper.setNumber} of 5`,
        fileName: `${subject.shortTitle}-periodic-test-${selectedChapters.map((chapter) => `ch-${chapter.number}`).join("-")}-paper-${paper.setNumber}`,
      },
      paper,
    );
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="rounded-lg border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-purple-50 p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-plum">Periodic test builder</p>
              <h1 className="mt-2 text-3xl font-bold">Generate mixed papers from selected chapters</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                Type chapter numbers or chapter names. The app creates 5 school-style sample papers using only those chapters, with answer sheets at the end.
              </p>
            </div>
            <Link href="/chapters" className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-white hover:bg-plum">
              View chapters
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.45fr_0.55fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-stone-700">Subject</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {class6Subjects.map((item) => {
                const active = subjectId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => switchSubject(item.id)}
                    className={`rounded-md border px-4 py-3 text-left text-sm font-bold transition ${
                      active ? "border-ink bg-ink text-white" : "border-stone-300 bg-white text-stone-700 hover:border-lagoon"
                    }`}
                  >
                    {item.title}
                    <span className={`block text-xs font-semibold ${active ? "text-white/80" : "text-stone-500"}`}>{item.bookTitle}</span>
                  </button>
                );
              })}
            </div>

            <label className="mt-5 block">
              <span className="flex items-center gap-2 text-sm font-bold text-stone-700">
                <Search size={16} aria-hidden="true" />
                Chapters coming in test
              </span>
              <textarea
                value={chapterInput}
                onChange={(event) => setChapterInput(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15"
                placeholder="Example: 1, 3, 6 or Fractions, Symmetry"
              />
            </label>

            <div className="mt-4 rounded-md border border-sky-100 bg-sky-50 p-3">
              <p className="text-sm font-bold text-stone-700">Example</p>
              <p className="mt-1 text-sm text-stone-600">
                Science periodic test: <span className="font-bold">1, 3, 6</span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md text-white" style={{ backgroundColor: subject.accent }}>
                <FileText size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: subject.accent }}>
                  {subject.title}
                </p>
                <h2 className="text-2xl font-bold">Generated papers</h2>
              </div>
            </div>

            {selectedChapters.length ? (
              <>
                <div className="mt-4 rounded-md bg-[#fbfaf6] p-3">
                  <p className="text-sm font-bold text-stone-700">Selected chapters</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{chapterLine(selectedChapters)}</p>
                </div>

                <div className="mt-4 grid gap-3">
                  {papers.map((paper) => (
                    <article key={paper.id} className="rounded-md border border-stone-200 bg-white p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-bold">{paper.title}</h3>
                          <p className="mt-1 text-sm text-stone-600">{paperFormatLine(subjectId)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadPaper(paper.setNumber)}
                          className="inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-bold text-white hover:bg-[#d97706]"
                        >
                          <Download size={16} aria-hidden="true" />
                          Download PDF
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-md border border-dashed border-stone-300 bg-[#fbfaf6] p-5">
                <p className="font-bold">No chapters matched yet</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Type chapter numbers such as <span className="font-bold">1, 3, 6</span>, or chapter names from {subject.bookTitle}.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
