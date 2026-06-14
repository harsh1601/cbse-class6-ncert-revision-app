"use client";

import { useMemo, useState } from "react";
import { Brain, CheckCircle2, RotateCcw, Sparkles, XCircle } from "lucide-react";

type MentalMathQuestion = {
  id: string;
  prompt: string;
  answer: number;
  options: number[];
  hint: string;
};

function rotate<T>(items: T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

function uniqueOptions(answer: number, nearby: number[], seed: number) {
  const values = [answer, ...nearby].filter((value, index, items) => Number.isFinite(value) && value >= 0 && items.indexOf(value) === index).slice(0, 4);
  let filler = answer + seed + 2;

  while (values.length < 4) {
    if (!values.includes(filler)) {
      values.push(filler);
    }
    filler += 3;
  }

  return rotate(values, seed % values.length);
}

function makeQuestion(index: number): MentalMathQuestion {
  const seed = index + 1;
  const a = 8 + seed * 3;
  const b = 5 + seed * 2;
  const c = 10 + seed;

  if (index % 6 === 0) {
    const answer = a + b + c;
    return {
      id: `mental-add-${seed}`,
      prompt: `${a} + ${b} + ${c} = ?`,
      answer,
      options: uniqueOptions(answer, [answer - 5, answer + 4, answer + 9], seed),
      hint: "Add the easiest pair first, then add the remaining number.",
    };
  }

  if (index % 6 === 1) {
    const answer = (seed + 4) * 9;
    return {
      id: `mental-table-${seed}`,
      prompt: `${seed + 4} x 9 = ?`,
      answer,
      options: uniqueOptions(answer, [answer - 9, answer + 9, answer + 3], seed),
      hint: "For 9 times, multiply by 10 and subtract the number once.",
    };
  }

  if (index % 6 === 2) {
    const total = 100;
    const used = 17 + seed * 4;
    const answer = total - used;
    return {
      id: `mental-hundred-${seed}`,
      prompt: `100 - ${used} = ?`,
      answer,
      options: uniqueOptions(answer, [answer - 10, answer + 10, answer + 1], seed),
      hint: "Think how much more is needed to reach 100.",
    };
  }

  if (index % 6 === 3) {
    const answer = (seed + 5) * 2 + 10;
    return {
      id: `mental-double-${seed}`,
      prompt: `Double ${seed + 5}, then add 10. What do you get?`,
      answer,
      options: uniqueOptions(answer, [answer - 2, answer + 4, answer + 10], seed),
      hint: "Double means multiply by 2.",
    };
  }

  if (index % 6 === 4) {
    const answer = 25 * (seed + 2);
    return {
      id: `mental-quarters-${seed}`,
      prompt: `${seed + 2} groups of 25 = ?`,
      answer,
      options: uniqueOptions(answer, [answer - 25, answer + 25, answer + 10], seed),
      hint: "Four groups of 25 make 100.",
    };
  }

  const answer = (seed + 3) * 5;
  return {
    id: `mental-five-${seed}`,
    prompt: `${seed + 3} x 5 = ?`,
    answer,
    options: uniqueOptions(answer, [answer - 5, answer + 5, answer + 15], seed),
    hint: "Multiply by 10, then take half.",
  };
}

const questions = Array.from({ length: 10 }, (_, index) => makeQuestion(index));

export function MentalMathQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => questions.filter((question) => answers[question.id] === question.answer).length,
    [answers],
  );
  const answeredCount = Object.keys(answers).length;

  function choose(question: MentalMathQuestion, option: number) {
    if (submitted) {
      return;
    }

    setAnswers((current) => ({ ...current, [question.id]: option }));
  }

  function resetQuiz() {
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
              Practice fast Maths without writing long steps. Choose the answer in your head, then check your score.
            </p>
          </div>
        </div>

        <div className="rounded-md bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Score</p>
          <p className="mt-1 text-2xl font-black text-ink">{submitted ? `${score}/10` : `${answeredCount}/10`}</p>
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
          Try again
        </button>
      </div>
    </section>
  );
}

