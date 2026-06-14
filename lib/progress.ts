"use client";

import { allChapters, class6Subjects, type ChapterId, type ExamGoal } from "@/features/biology/content";

export type StudentProfile = {
  name: string;
  dailyMinutes: 20 | 40 | 60;
  goals: ExamGoal[];
  createdAt: string;
};

export type QuestionResult = {
  questionId: string;
  type: string;
  correct: boolean;
  conceptTags: string[];
};

export type PracticeAttempt = {
  id: string;
  topicId: ChapterId;
  paperId: string;
  paperSet: number;
  score: number;
  total: number;
  createdAt: string;
  weakConcepts: string[];
  questionResults: QuestionResult[];
};

export type GameScore = {
  score: number;
  total: number;
  updatedAt: string;
  weakConcepts: string[];
};

export type StudyProgress = {
  completedLessons: Record<string, string>;
  gameScores: Record<string, GameScore>;
  attempts: PracticeAttempt[];
};

export type PracticeDraft = {
  paperId: string;
  answers: Record<string, string>;
  confidence: Record<string, string>;
  updatedAt: string;
};

const profileKey = "class6-ncert-revision-profile";
const progressKey = "class6-ncert-revision-progress";
const draftPrefix = "class6-ncert-practice-draft:";

const emptyProgress: StudyProgress = {
  completedLessons: {},
  gameScores: {},
  attempts: [],
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function readProfile(): StudentProfile | null {
  return readJson<StudentProfile | null>(profileKey, null);
}

export function saveProfile(profile: StudentProfile) {
  writeJson(profileKey, profile);
}

export function readProgress(): StudyProgress {
  return readJson<StudyProgress>(progressKey, emptyProgress);
}

export function saveProgress(progress: StudyProgress) {
  writeJson(progressKey, progress);
}

export function markLessonComplete(chapterId: ChapterId) {
  const progress = readProgress();
  progress.completedLessons[chapterId] = new Date().toISOString();
  saveProgress(progress);
}

export function saveGameScore(chapterId: ChapterId, score: GameScore) {
  const progress = readProgress();
  progress.gameScores[chapterId] = score;
  saveProgress(progress);
}

export function savePracticeAttempt(attempt: PracticeAttempt) {
  const progress = readProgress();
  progress.attempts = [attempt, ...progress.attempts].slice(0, 120);
  saveProgress(progress);
}

function draftKey(paperId: string) {
  return `${draftPrefix}${paperId}`;
}

export function readPracticeDraft(paperId: string): PracticeDraft | null {
  return readJson<PracticeDraft | null>(draftKey(paperId), null);
}

export function savePracticeDraft(paperId: string, answers: Record<string, string>, confidence: Record<string, string>) {
  const hasAnswers = Object.values(answers).some((value) => value.trim());
  const hasConfidence = Object.values(confidence).some(Boolean);

  if (!hasAnswers && !hasConfidence) {
    clearPracticeDraft(paperId);
    return null;
  }

  const draft: PracticeDraft = {
    paperId,
    answers,
    confidence,
    updatedAt: new Date().toISOString(),
  };

  writeJson(draftKey(paperId), draft);
  return draft;
}

export function clearPracticeDraft(paperId: string) {
  if (canUseStorage()) {
    window.localStorage.removeItem(draftKey(paperId));
  }
}

export function resetLocalStudyData() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(profileKey);
  window.localStorage.removeItem(progressKey);

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith(draftPrefix)) {
      window.localStorage.removeItem(key);
    }
  }
}

export function getTopicAttempts(progress: StudyProgress, chapterId: string) {
  return progress.attempts
    .filter((attempt) => attempt.topicId === chapterId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getLatestAttempt(progress: StudyProgress, chapterId: string) {
  return getTopicAttempts(progress, chapterId)[0];
}

export function getPreviousAttempt(progress: StudyProgress, chapterId: string) {
  return getTopicAttempts(progress, chapterId)[1];
}

export function getAttemptPercent(attempt?: PracticeAttempt) {
  if (!attempt || attempt.total === 0) {
    return 0;
  }

  return Math.round((attempt.score / attempt.total) * 100);
}

export function getMasteryForChapter(progress: StudyProgress, chapterId: ChapterId) {
  const lessonScore = progress.completedLessons[chapterId] ? 35 : 0;
  const latestAttempt = getLatestAttempt(progress, chapterId);
  const practiceScore = latestAttempt ? Math.round((latestAttempt.score / latestAttempt.total) * 65) : 0;

  return Math.min(100, lessonScore + practiceScore);
}

export const getMasteryForTopic = getMasteryForChapter;

export function getWeakConcepts(progress: StudyProgress) {
  const conceptCounts = new Map<string, number>();

  for (const attempt of progress.attempts) {
    for (const concept of attempt.weakConcepts) {
      conceptCounts.set(concept, (conceptCounts.get(concept) ?? 0) + 1);
    }
  }

  for (const score of Object.values(progress.gameScores)) {
    for (const concept of score.weakConcepts) {
      conceptCounts.set(concept, (conceptCounts.get(concept) ?? 0) + 1);
    }
  }

  return [...conceptCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([concept, count]) => ({ concept, count }));
}

export function getPlannedChapterId(progress: StudyProgress): ChapterId {
  const weakChapter = allChapters
    .map((chapter) => ({
      chapter,
      mastery: getMasteryForChapter(progress, chapter.id),
    }))
    .filter(({ mastery }) => mastery > 0 && mastery < 70)
    .sort((a, b) => a.mastery - b.mastery)[0]?.chapter;

  if (weakChapter) {
    return weakChapter.id;
  }

  const nextChapter = allChapters.find((chapter) => !progress.completedLessons[chapter.id]);
  return nextChapter?.id ?? allChapters[0].id;
}

export const getPlannedTopicId = getPlannedChapterId;

export function getSubjectMastery(progress: StudyProgress, subjectId: string) {
  const chapters = class6Subjects.find((subject) => subject.id === subjectId)?.chapters ?? [];

  if (!chapters.length) {
    return 0;
  }

  return Math.round(chapters.reduce((total, chapter) => total + getMasteryForChapter(progress, chapter.id), 0) / chapters.length);
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
