"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain, CheckCircle2, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { mentalMathQuestionBank, type MentalMathDifficulty, type MentalMathQuestion } from "./mentalMathBank";

const difficultyOrder: MentalMathDifficulty[] = ["easy", "medium", "hard"];
const questionsPerDifficulty = 5;

const difficultyStyles: Record<MentalMathDifficulty, string> = {
  easy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  hard: "border-coral/25 bg-coral/10 text-coral",
};

function shuffle<T>(items: T[]) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function buildQuizQuestions() {
  const groupedQuestions = difficultyOrder.flatMap((difficulty) =>
    shuffle(mentalMathQuestionBank.filter((question) => question.difficulty === difficulty)).slice(0, questionsPerDifficulty),
  );

  return shuffle(groupedQuestions);
}

function buildStarterQuestions() {
  return difficultyOrder.flatMap((difficulty) =>
    mentalMathQuestionBank.filter((question) => question.difficulty === difficulty).slice(0, questionsPerDifficulty),
  );
}

export function MentalMathQuiz() {
  const [questions, setQuestions] = useState<MentalMathQuestion[]>(() => buildStarterQuestions());
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setQuestions(buildQuizQuestions());
  }, []);

  const score = useMemo(
    () => questions.filter((question) => answers[question.id] === question.answer).length,
    [answers],
  );
  const answeredCount = Object.keys(answers).length;
  const difficultyCounts = useMemo(
    () =>
      difficultyOrder.map((difficulty) => ({
        difficulty,
        count: questions.filter((question) => question.difficulty === difficulty).length,
      })),
    [questions],
  );

  function choose(question: MentalMathQuestion, option: number) {
    if (submitted) {
      return;
    }

    setAnswers((current) => ({ ...current, [question.id]: option }));
  }

  function resetQuiz() {
    setQuestions(buildQuizQuestions());
    setAnswers({});
    setShowHints({});
    setSubmitted(false);
  }

  return (
    <section className="mt-5 rounded-lg border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-amber-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-moss text-white">
            <Brain size={21} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Mental Math</p>
            <h2 className="mt-1 text-2xl font-bold">Quick calculation quiz</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Practice 15 random questions from a 120-question bank covering CBSE Class 6 Maths topics.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {difficultyCounts.map(({ difficulty, count }) => (
                <span
                  key={difficulty}
                  className={`rounded-md border px-2 py-1 text-xs font-black uppercase tracking-[0.12em] ${difficultyStyles[difficulty]}`}
                >
                  {count} {difficulty}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Score</p>
          <p className="mt-1 text-2xl font-black text-ink">
            {submitted ? `${score}/${questions.length}` : `${answeredCount}/${questions.length}`}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const correct = selected === question.answer;

          return (
            <article key={question.id} className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">Q{index + 1}</p>
                  <h3 className="mt-1 text-lg font-bold">{question.prompt}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${difficultyStyles[question.difficulty]}`}>
                      {question.difficulty}
                    </span>
                    <span className="rounded-md border border-sky-100 bg-sky-50 px-2 py-1 text-[11px] font-bold text-sky-700">{question.topic}</span>
                  </div>
                </div>
                {submitted ? (
                  <span className={`flex h-8 w-8 items-center justify-center rounded-md ${correct ? "bg-moss text-white" : "bg-coral text-white"}`}>
                    {correct ? <CheckCircle2 size={17} aria-hidden="true" /> : <XCircle size={17} aria-hidden="true" />}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(question, option)}
                    className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                      selected === option
                        ? "border-moss bg-moss text-white"
                        : "border-stone-300 bg-[#fbfaf6] text-stone-700 hover:border-moss"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHints((current) => ({ ...current, [question.id]: !current[question.id] }))}
                  className="inline-flex items-center gap-1 rounded-md border border-amber/40 bg-amber/10 px-2 py-1 text-xs font-bold text-amber"
                >
                  <Sparkles size={13} aria-hidden="true" />
                  Hint
                </button>
                {submitted && !correct ? <span className="text-xs font-bold text-coral">Answer: {question.answer}</span> : null}
              </div>
              {showHints[question.id] ? <p className="mt-2 text-sm leading-6 text-stone-600">{question.hint}</p> : null}
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={answeredCount < questions.length || submitted}
          className="rounded-md bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          Submit quiz
        </button>
        <button
          type="button"
          onClick={resetQuiz}
          className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-coral"
        >
          <RotateCcw size={16} aria-hidden="true" />
          New random quiz
        </button>
      </div>
    </section>
  );
}
