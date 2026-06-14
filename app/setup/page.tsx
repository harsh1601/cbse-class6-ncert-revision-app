"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check, Clock, GraduationCap } from "lucide-react";
import { LogoOptions } from "@/components/LogoOptions";
import { SourceBadge } from "@/components/SourceBadge";
import { class6Subjects, type ExamGoal } from "@/features/biology/content";
import { saveProfile } from "@/lib/progress";

const goalOptions: Array<{ id: ExamGoal; label: string }> = [
  { id: "daily-revision", label: "Daily revision" },
  { id: "school-exam", label: "School exam" },
  { id: "quick-practice", label: "Quick practice" },
];

const minuteOptions = [20, 40, 60] as const;

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState<(typeof minuteOptions)[number]>(40);
  const [goals, setGoals] = useState<ExamGoal[]>(["daily-revision", "school-exam"]);

  function toggleGoal(goal: ExamGoal) {
    setGoals((current) => {
      if (current.includes(goal)) {
        return current.length === 1 ? current : current.filter((item) => item !== goal);
      }

      return [...current, goal];
    });
  }

  function startPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveProfile({
      name: name.trim() || "Student",
      dailyMinutes,
      goals,
      createdAt: new Date().toISOString(),
    });
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-5">
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-white">
                <BookOpen size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">CBSE Class 6</p>
                <h1 className="text-3xl font-bold leading-tight">NCERT Revision App</h1>
              </div>
            </div>

            <div className="mt-7 grid gap-4">
              <div className="rounded-md bg-[#f4f2ea] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber">Subjects covered</p>
                <h2 className="mt-2 text-xl font-bold">Science, Mathematics, and Social Science</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Each NCERT chapter has a revision area, key terms, practice papers, answer keys, and local progress tracking. Maths chapters include 10 practical-focused papers each.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {class6Subjects.map((subject) => (
                  <div key={subject.id} className="rounded-md border border-stone-200 p-3" style={{ backgroundColor: subject.softAccent }}>
                    <GraduationCap size={20} style={{ color: subject.accent }} aria-hidden="true" />
                    <p className="mt-2 text-sm font-bold">{subject.shortTitle}</p>
                    <p className="mt-1 text-xs font-semibold text-stone-600">{subject.chapters.length} chapters</p>
                  </div>
                ))}
              </div>

              <SourceBadge sourceRefIds={["ncert-service", "ncert-science", "ncert-maths", "ncert-sst"]} />
            </div>
          </section>

          <LogoOptions />
        </div>

        <form onSubmit={startPlan} className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Student setup</p>
          <h2 className="mt-2 text-2xl font-bold">Create your revision plan</h2>

          <label className="mt-6 block">
            <span className="text-sm font-bold text-stone-700">Student name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-base outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15"
              placeholder="Your name"
            />
          </label>

          <div className="mt-5">
            <p className="flex items-center gap-2 text-sm font-bold text-stone-700">
              <Clock size={16} aria-hidden="true" />
              Daily study time
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {minuteOptions.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setDailyMinutes(minutes)}
                  className={`rounded-md border px-3 py-3 text-sm font-bold transition ${
                    dailyMinutes === minutes ? "border-moss bg-moss text-white" : "border-stone-300 bg-white text-stone-700 hover:border-moss"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="flex items-center gap-2 text-sm font-bold text-stone-700">
              <Check size={16} aria-hidden="true" />
              Revision goal
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {goalOptions.map((goal) => {
                const active = goals.includes(goal.id);

                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`rounded-md border px-3 py-3 text-sm font-bold transition ${
                      active ? "border-coral bg-coral text-white" : "border-stone-300 bg-white text-stone-700 hover:border-coral"
                    }`}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-base font-bold text-white transition hover:bg-moss">
            Start revision
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}
