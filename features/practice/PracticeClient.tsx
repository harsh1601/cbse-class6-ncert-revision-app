"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardCheck, Download, MessageCircleQuestion, RotateCcw, Save, XCircle } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { SourceBadge } from "@/components/SourceBadge";
import { getQuestionPapers, type Chapter, type FillBlankQuestion, type McqQuestion, type QuestionPaper, type TrueFalseQuestion, type WrittenQuestion } from "@/features/biology/content";
import { downloadMixedSamplePaperPdf } from "@/features/practice/pdf";
import { SpeechToTextButton } from "@/features/practice/SpeechToTextButton";
import {
  clearPracticeDraft,
  getAttemptPercent,
  getLatestAttempt,
  readProfile,
  readPracticeDraft,
  readProgress,
  savePracticeDraft,
  savePracticeAttempt,
  type PracticeAttempt,
  type QuestionResult,
} from "@/lib/progress";

type WrittenConfidence = "included" | "needs-revision";

type ResultState = {
  attempt: PracticeAttempt;
  previousPercent: number | null;
  improvement: number | null;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function rotate<T>(items: T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

function objectiveTotal(paper: QuestionPaper) {
  return paper.mcqs.length + paper.matches.length + paper.trueFalse.length + paper.blanks.length;
}

function questionFormatText(chapter: Chapter, papersLength: number) {
  if (chapter.subjectId === "maths") {
    return `This Maths chapter has ${papersLength} practice papers. Each paper has 10 MCQs and 20 practical/application questions. Matching, fill in the blanks, short-answer, and long-answer sections are skipped for Maths.`;
  }

  return `This chapter has ${papersLength} practice paper${papersLength === 1 ? "" : "s"}. Each paper has 10 MCQs, 5 match the following, 7 true/false, 8 fill in the blanks, 5 short questions, and 2 long questions.`;
}

const stopWords = new Set([
  "about",
  "answer",
  "chapter",
  "clear",
  "define",
  "example",
  "explain",
  "important",
  "include",
  "means",
  "model",
  "point",
  "question",
  "revision",
  "terms",
  "using",
  "write",
]);

function keywordList(question: WrittenQuestion) {
  const text = [question.prompt, question.modelAnswer, ...question.keyPoints].join(" ");
  return Array.from(
    new Set(
      normalize(text)
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 4 && !stopWords.has(word)),
    ),
  ).slice(0, 12);
}

function validateWrittenAnswer(question: WrittenQuestion, answer: string) {
  const normalizedAnswer = normalize(answer).replace(/[^a-z0-9\s]/g, " ");
  const words = normalizedAnswer.split(/\s+/).filter(Boolean);
  const keywords = keywordList(question);
  const matched = keywords.filter((keyword) => normalizedAnswer.includes(keyword));
  const isLong = question.id.includes("-long-");
  const requiredWords = isLong ? 18 : 6;
  const requiredMatches = isLong ? 3 : 2;

  return {
    correct: words.length >= requiredWords && matched.length >= requiredMatches,
    matched,
    missing: keywords.filter((keyword) => !matched.includes(keyword)).slice(0, 5),
    requiredMatches,
    requiredWords,
    wordCount: words.length,
  };
}

function formatDraftTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function appendTranscript(answer: string, transcript: string) {
  return [answer.trim(), transcript.trim()].filter(Boolean).join(" ");
}

export function PracticeClient({ chapter }: { chapter: Chapter }) {
  const router = useRouter();
  const papers = useMemo(() => getQuestionPapers(chapter), [chapter]);
  const [selectedSet, setSelectedSet] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidence, setConfidence] = useState<Record<string, WrittenConfidence>>({});
  const [result, setResult] = useState<ResultState | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!readProfile()) {
      router.replace("/setup");
      return;
    }

    const queryPaper = Number(new URLSearchParams(window.location.search).get("paper"));
    if (queryPaper >= 1 && queryPaper <= papers.length) {
      setSelectedSet(queryPaper);
    }
  }, [papers.length, router]);

  const paper = papers.find((item) => item.setNumber === selectedSet) ?? papers[0];
  const isMathsPaper = chapter.subjectId === "maths";
  const writtenQuestions = isMathsPaper ? paper.practicalQuestions ?? [] : [...paper.shortAnswers, ...paper.longAnswers];
  const objectiveCount = objectiveTotal(paper);

  useEffect(() => {
    const draft = readPracticeDraft(paper.id);
    setAnswers(draft?.answers ?? {});
    setConfidence((draft?.confidence ?? {}) as Record<string, WrittenConfidence>);
    setDraftSavedAt(draft?.updatedAt ?? null);
    setResult(null);
  }, [paper.id]);

  useEffect(() => {
    if (result) {
      return;
    }

    const timer = window.setTimeout(() => {
      const draft = savePracticeDraft(paper.id, answers, confidence);
      setDraftSavedAt(draft?.updatedAt ?? null);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [answers, confidence, paper.id, result]);

  const answeredCount = useMemo(() => {
    const mcq = paper.mcqs.filter((question) => answers[question.id]).length;
    const matches = paper.matches.filter((question) => answers[question.id]).length;
    const trueFalse = paper.trueFalse.filter((question) => answers[question.id]).length;
    const blanks = paper.blanks.filter((question) => answers[question.id]?.trim()).length;
    const written = writtenQuestions.filter((question) => answers[question.id]?.trim() && confidence[question.id]).length;
    return mcq + matches + trueFalse + blanks + written;
  }, [answers, confidence, paper, writtenQuestions]);

  const totalQuestions = objectiveCount + writtenQuestions.length;

  function changePaper(setNumber: number) {
    setSelectedSet(setNumber);
    window.history.replaceState(null, "", `/practice/${chapter.id}?paper=${setNumber}`);
  }

  function setAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function submitAttempt() {
    const questionResults: QuestionResult[] = [
      ...paper.mcqs.map((question) => ({
        questionId: question.id,
        type: "mcq",
        correct: answers[question.id] === question.correctAnswer,
        conceptTags: [question.correctAnswer],
      })),
      ...paper.matches.map((question) => ({
        questionId: question.id,
        type: "match",
        correct: answers[question.id] === question.right,
        conceptTags: [question.left],
      })),
      ...paper.trueFalse.map((question) => ({
        questionId: question.id,
        type: "true-false",
        correct: answers[question.id] === String(question.correctAnswer),
        conceptTags: [question.explanation],
      })),
      ...paper.blanks.map((question) => ({
        questionId: question.id,
        type: "fill-blank",
        correct: normalize(answers[question.id] ?? "") === normalize(question.correctAnswer),
        conceptTags: [question.correctAnswer],
      })),
      ...writtenQuestions.map((question) => ({
        questionId: question.id,
        type: question.id.includes("-practical-") ? "practical" : question.id.includes("-long-") ? "long" : "short",
        correct: validateWrittenAnswer(question, answers[question.id] ?? "").correct && confidence[question.id] !== "needs-revision",
        conceptTags: question.keyPoints.slice(0, 2),
      })),
    ];

    const objectiveResults = questionResults.filter((item) => ["mcq", "match", "true-false", "fill-blank"].includes(item.type));
    const score = objectiveResults.filter((item) => item.correct).length;
    const weakConcepts = Array.from(new Set(questionResults.filter((item) => !item.correct).flatMap((item) => item.conceptTags))).slice(0, 12);
    const storedProgress = readProgress();
    const previousAttempt = getLatestAttempt(storedProgress, chapter.id);
    const attempt: PracticeAttempt = {
      id: `${paper.id}-${Date.now()}`,
      topicId: chapter.id,
      paperId: paper.id,
      paperSet: paper.setNumber,
      score,
      total: objectiveCount,
      createdAt: new Date().toISOString(),
      weakConcepts,
      questionResults,
    };

    savePracticeAttempt(attempt);
    clearPracticeDraft(paper.id);
    setDraftSavedAt(null);

    const currentPercent = getAttemptPercent(attempt);
    const previousPercent = previousAttempt ? getAttemptPercent(previousAttempt) : null;

    setResult({
      attempt,
      previousPercent,
      improvement: previousPercent === null ? null : currentPercent - previousPercent,
    });
  }

  function resetAttempt() {
    setAnswers({});
    setConfidence({});
    setResult(null);
    setDraftSavedAt(null);
    clearPracticeDraft(paper.id);
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-coral">Practice papers</p>
              <h1 className="mt-2 text-3xl font-bold">{chapter.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{questionFormatText(chapter, papers.length)}</p>
            </div>
            <div className="rounded-md bg-[#f4f2ea] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Answered</p>
              <p className="mt-1 text-2xl font-black text-ink">
                {answeredCount}/{totalQuestions}
              </p>
              <p className="mt-1 text-xs font-bold text-moss">{draftSavedAt ? `Autosaved ${formatDraftTime(draftSavedAt)}` : "Autosave ready"}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {papers.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => changePaper(item.setNumber)}
                className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                  selectedSet === item.setNumber ? "border-ink bg-ink text-white" : "border-stone-300 bg-white text-stone-700 hover:border-moss"
                }`}
              >
                Paper {item.setNumber}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadMixedSamplePaperPdf(chapter, papers)}
              className="inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d97706]"
            >
              <Download size={16} aria-hidden="true" />
              Download mixed PDF
            </button>
            <Link href={`/chat-tutor?chapter=${chapter.id}`} className="inline-flex items-center gap-2 rounded-md bg-lagoon px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0284c7]">
              <MessageCircleQuestion size={16} aria-hidden="true" />
              Ask a Doubt
            </Link>
            <span className="self-center text-sm font-semibold text-stone-600">
              The PDF combines questions from all {papers.length} practice papers.
            </span>
          </div>

          <div className="mt-4">
            <SourceBadge sourceRefIds={chapter.sourceRefIds} />
          </div>
        </section>

        {result ? (
          <section className="mt-5 rounded-lg border border-moss bg-white p-5 shadow-soft">
            <div className="grid gap-5 lg:grid-cols-[0.7fr_0.3fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Result</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {result.attempt.score}/{result.attempt.total} objective answers correct
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {result.improvement === null
                    ? "This is the first saved attempt for this chapter."
                    : `Improvement from previous attempt: ${result.improvement >= 0 ? "+" : ""}${result.improvement} percentage points.`}
                </p>
              </div>
              <div className="rounded-md bg-[#f4f2ea] p-4">
                <p className="text-sm font-bold">Revise next</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.attempt.weakConcepts.length ? (
                    result.attempt.weakConcepts.slice(0, 6).map((concept) => (
                      <span key={concept} className="rounded-md bg-white px-2 py-1 text-xs font-bold text-coral">
                        {concept}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-semibold text-moss">No weak areas in objective scoring.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/progress" className="inline-flex items-center gap-2 rounded-md bg-moss px-4 py-3 text-sm font-bold text-white">
                <ClipboardCheck size={16} aria-hidden="true" />
                View progress
              </Link>
              <Link href={`/learn/${chapter.id}#notes`} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 hover:border-moss">
                Review notes
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <button type="button" onClick={resetAttempt} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 hover:border-coral">
                <RotateCcw size={16} aria-hidden="true" />
                Try again
              </button>
            </div>
          </section>
        ) : null}

        <form className="mt-5 grid gap-5" onSubmit={(event) => event.preventDefault()}>
          <QuestionSection title="Multiple Choice Questions" count="10 questions">
            {paper.mcqs.map((question, index) => (
              <McqPanel
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id] ?? ""}
                submitted={Boolean(result)}
                onAnswer={(value) => setAnswer(question.id, value)}
              />
            ))}
          </QuestionSection>

          {isMathsPaper ? (
            <QuestionSection title="Practical Questions" count={`${writtenQuestions.length} questions`}>
              {writtenQuestions.map((question, index) => (
                <WrittenPanel
                  key={question.id}
                  question={question}
                  index={index}
                  answer={answers[question.id] ?? ""}
                  confidence={confidence[question.id]}
                  submitted={Boolean(result)}
                  rows={4}
                  actionLabel="I showed steps"
                  placeholder="Show the steps, working, and final answer."
                  onAnswer={(value) => setAnswer(question.id, value)}
                  onConfidence={(value) => setConfidence((current) => ({ ...current, [question.id]: value }))}
                />
              ))}
            </QuestionSection>
          ) : (
            <>
              <QuestionSection title="Match the Following" count="5 questions">
                {paper.matches.map((question, index) => (
                  <MatchPanel
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id] ?? ""}
                    options={rotate(paper.matches.map((item) => item.right), index + selectedSet)}
                    submitted={Boolean(result)}
                    onAnswer={(value) => setAnswer(question.id, value)}
                  />
                ))}
              </QuestionSection>

              <QuestionSection title="True or False" count="7 questions">
                {paper.trueFalse.map((question, index) => (
                  <TrueFalsePanel
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id] ?? ""}
                    submitted={Boolean(result)}
                    onAnswer={(value) => setAnswer(question.id, value)}
                  />
                ))}
              </QuestionSection>

              <QuestionSection title="Fill in the Blanks" count="8 questions">
                {paper.blanks.map((question, index) => (
                  <BlankPanel
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id] ?? ""}
                    submitted={Boolean(result)}
                    onAnswer={(value) => setAnswer(question.id, value)}
                  />
                ))}
              </QuestionSection>

              <QuestionSection title="Short Answer Questions" count="5 questions">
                {paper.shortAnswers.map((question, index) => (
                  <WrittenPanel
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id] ?? ""}
                    confidence={confidence[question.id]}
                    submitted={Boolean(result)}
                    rows={3}
                    onAnswer={(value) => setAnswer(question.id, value)}
                    onConfidence={(value) => setConfidence((current) => ({ ...current, [question.id]: value }))}
                  />
                ))}
              </QuestionSection>

              <QuestionSection title="Long Answer Questions" count="2 questions">
                {paper.longAnswers.map((question, index) => (
                  <WrittenPanel
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id] ?? ""}
                    confidence={confidence[question.id]}
                    submitted={Boolean(result)}
                    rows={6}
                    onAnswer={(value) => setAnswer(question.id, value)}
                    onConfidence={(value) => setConfidence((current) => ({ ...current, [question.id]: value }))}
                  />
                ))}
              </QuestionSection>
            </>
          )}

          <div className="flex flex-wrap gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <button
              type="button"
              onClick={submitAttempt}
              disabled={answeredCount < totalQuestions || Boolean(result)}
              className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <Save size={16} aria-hidden="true" />
              Submit paper
            </button>
            <Link href={`/learn/${chapter.id}`} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 hover:border-moss">
              Back to revision
            </Link>
          </div>
        </form>
      </div>
    </AppFrame>
  );
}

function QuestionSection({ title, count, children }: { title: string; count: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm font-bold text-stone-500">{count}</p>
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

function Feedback({
  correct,
  children,
  positiveLabel = "Correct",
  negativeLabel = "Revise this",
}: {
  correct: boolean;
  children: React.ReactNode;
  positiveLabel?: string;
  negativeLabel?: string;
}) {
  return (
    <div className={`mt-3 rounded-md border p-3 ${correct ? "border-moss bg-moss/5 text-moss" : "border-coral bg-coral/5 text-coral"}`}>
      <div className="flex items-start gap-2 text-sm font-bold">
        {correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
        <span>{correct ? positiveLabel : negativeLabel}</span>
      </div>
      <div className="mt-2 text-sm leading-6 text-stone-700">{children}</div>
    </div>
  );
}

function McqPanel({ question, index, answer, submitted, onAnswer }: { question: McqQuestion; index: number; answer: string; submitted: boolean; onAnswer: (value: string) => void }) {
  const correct = answer === question.correctAnswer;

  return (
    <div className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4">
      <p className="text-sm font-bold text-stone-500">Q{index + 1}</p>
      <h3 className="mt-1 text-base font-bold">{question.prompt}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onAnswer(option)}
            className={`rounded-md border px-3 py-3 text-left text-sm font-semibold transition ${
              answer === option ? "border-moss bg-moss text-white" : "border-stone-300 bg-white text-stone-700 hover:border-moss"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {submitted ? <Feedback correct={correct}>Answer: {question.correctAnswer}. {question.explanation}</Feedback> : null}
    </div>
  );
}

function MatchPanel({
  question,
  index,
  answer,
  options,
  submitted,
  onAnswer,
}: {
  question: { id: string; left: string; right: string };
  index: number;
  answer: string;
  options: string[];
  submitted: boolean;
  onAnswer: (value: string) => void;
}) {
  const correct = answer === question.right;

  return (
    <div className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4">
      <label className="grid gap-3 md:grid-cols-[0.45fr_0.55fr] md:items-center">
        <span>
          <span className="block text-sm font-bold text-stone-500">Q{index + 1}</span>
          <span className="mt-1 block text-base font-bold">{question.left}</span>
        </span>
        <select
          value={answer}
          onChange={(event) => onAnswer(event.target.value)}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15"
        >
          <option value="">Choose the correct match</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {submitted ? <Feedback correct={correct}>Correct match: {question.left} - {question.right}</Feedback> : null}
    </div>
  );
}

function TrueFalsePanel({
  question,
  index,
  answer,
  submitted,
  onAnswer,
}: {
  question: TrueFalseQuestion;
  index: number;
  answer: string;
  submitted: boolean;
  onAnswer: (value: string) => void;
}) {
  const correct = answer === String(question.correctAnswer);

  return (
    <div className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4">
      <p className="text-sm font-bold text-stone-500">Q{index + 1}</p>
      <h3 className="mt-1 text-base font-bold">{question.statement}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          ["true", "True"],
          ["false", "False"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onAnswer(value)}
            className={`rounded-md border px-4 py-2 text-sm font-bold transition ${
              answer === value ? "border-moss bg-moss text-white" : "border-stone-300 bg-white text-stone-700 hover:border-moss"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {submitted ? <Feedback correct={correct}>Answer: {question.correctAnswer ? "True" : "False"}. {question.explanation}</Feedback> : null}
    </div>
  );
}

function BlankPanel({ question, index, answer, submitted, onAnswer }: { question: FillBlankQuestion; index: number; answer: string; submitted: boolean; onAnswer: (value: string) => void }) {
  const correct = normalize(answer) === normalize(question.correctAnswer);

  return (
    <div className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4">
      <label>
        <span className="block text-sm font-bold text-stone-500">Q{index + 1}</span>
        <span className="mt-1 block text-base font-bold">{question.prompt}</span>
        <input
          value={answer}
          onChange={(event) => onAnswer(event.target.value)}
          className="mt-3 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15"
          placeholder="Type the missing word"
          disabled={submitted}
        />
      </label>
      {!submitted ? (
        <div className="mt-3">
          <SpeechToTextButton onTranscript={onAnswer} />
        </div>
      ) : null}
      {submitted ? <Feedback correct={correct}>Answer: {question.correctAnswer}. {question.explanation}</Feedback> : null}
    </div>
  );
}

function WrittenPanel({
  question,
  index,
  answer,
  confidence,
  submitted,
  rows,
  actionLabel = "I included key points",
  placeholder = "Write the answer in your own words.",
  onAnswer,
  onConfidence,
}: {
  question: WrittenQuestion;
  index: number;
  answer: string;
  confidence?: WrittenConfidence;
  submitted: boolean;
  rows: number;
  actionLabel?: string;
  placeholder?: string;
  onAnswer: (value: string) => void;
  onConfidence: (value: WrittenConfidence) => void;
}) {
  const validation = validateWrittenAnswer(question, answer);
  const correct = validation.correct && confidence !== "needs-revision";

  return (
    <div className="rounded-md border border-stone-200 bg-[#fbfaf6] p-4">
      <p className="text-sm font-bold text-stone-500">Q{index + 1}</p>
      <h3 className="mt-1 text-base font-bold">{question.prompt}</h3>
      <textarea
        value={answer}
        onChange={(event) => onAnswer(event.target.value)}
        rows={rows}
        className="mt-3 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15"
        placeholder={placeholder}
        disabled={submitted}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {!submitted ? <SpeechToTextButton onTranscript={(transcript) => onAnswer(appendTranscript(answer, transcript))} /> : null}
        <button
          type="button"
          onClick={() => onConfidence("included")}
          disabled={submitted}
          className={`rounded-md border px-3 py-2 text-sm font-bold ${
            confidence === "included" ? "border-moss bg-moss text-white" : "border-stone-300 bg-white text-stone-700 hover:border-moss"
          }`}
        >
          {actionLabel}
        </button>
        <button
          type="button"
          onClick={() => onConfidence("needs-revision")}
          disabled={submitted}
          className={`rounded-md border px-3 py-2 text-sm font-bold ${
            confidence === "needs-revision" ? "border-coral bg-coral text-white" : "border-stone-300 bg-white text-stone-700 hover:border-coral"
          }`}
        >
          Needs revision
        </button>
      </div>
      {submitted ? (
        <Feedback correct={correct} positiveLabel="Looks complete" negativeLabel="Needs more key points">
          <p className="font-semibold">
            Keyword check: {validation.matched.length}/{validation.requiredMatches} needed, {validation.wordCount}/{validation.requiredWords} words needed.
          </p>
          {validation.missing.length ? <p className="mt-1">Try adding: {validation.missing.join(", ")}.</p> : null}
          <p className="font-semibold">Model answer: {question.modelAnswer}</p>
          <ul className="mt-2 grid gap-1">
            {question.keyPoints.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
        </Feedback>
      ) : null}
    </div>
  );
}
