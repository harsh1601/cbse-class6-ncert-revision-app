"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { getQuestionPapers, type Chapter } from "@/features/biology/content";
import { saveGameScore } from "@/lib/progress";

export function TopicGame({ chapter }: { chapter: Chapter }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const questions = useMemo(() => getQuestionPapers(chapter)[0].mcqs.slice(0, 3), [chapter]);
  const completed = questions.every((question) => answers[question.id]);
  const score = questions.filter((question) => answers[question.id] === question.correctAnswer).length;

  function choose(questionId: string, choice: string) {
    setAnswers((current) => ({ ...current, [questionId]: choice }));
    setSaved(false);
  }

  function saveScore() {
    const weakConcepts = questions
      .filter((question) => answers[question.id] !== question.correctAnswer)
      .map((question) => question.correctAnswer);

    saveGameScore(chapter.id, {
      score,
      total: questions.length,
      updatedAt: new Date().toISOString(),
      weakConcepts,
    });
    setSaved(true);
  }

  function reset() {
    setAnswers({});
    setSaved(false);
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber">Quick check</p>
          <h2 className="mt-1 text-2xl font-bold">Three-question warmup</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Answer these before opening the full practice paper.</p>
        </div>
        <div className="rounded-md bg-stone-100 px-3 py-2 text-sm font-bold text-stone-700">
          Score {score}/{questions.length}
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const correct = selected === question.correctAnswer;

          return (
            <div key={question.id} className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{question.prompt}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {question.options.map((choice) => {
                      const active = selected === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => choose(question.id, choice)}
                          className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                            active ? "border-moss bg-moss text-white" : "border-stone-300 bg-white text-stone-700 hover:border-moss"
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>

                  {selected ? (
                    <div className={`mt-3 flex items-start gap-2 text-sm ${correct ? "text-moss" : "text-coral"}`}>
                      {correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
                      <span>{correct ? question.explanation : `Correct answer: ${question.correctAnswer}. ${question.explanation}`}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveScore}
          disabled={!completed}
          className="inline-flex items-center gap-2 rounded-md bg-moss px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2d5745] disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          <Sparkles size={16} aria-hidden="true" />
          Save quick check
        </button>
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:border-moss">
          <RotateCcw size={16} aria-hidden="true" />
          Replay
        </button>
        {saved ? <span className="self-center text-sm font-semibold text-moss">Saved to progress.</span> : null}
      </div>
    </section>
  );
}
