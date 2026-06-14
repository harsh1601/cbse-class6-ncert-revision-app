import {
  getQuestionPapers,
  getSubjectById,
  type Chapter,
  type FillBlankQuestion,
  type MatchQuestion,
  type McqQuestion,
  type QuestionPaper,
  type SubjectId,
  type TrueFalseQuestion,
  type WrittenQuestion,
} from "@/features/biology/content";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function uniqueChapters(chapters: Chapter[]) {
  const seen = new Set<string>();
  return chapters.filter((chapter) => {
    if (seen.has(chapter.id)) {
      return false;
    }

    seen.add(chapter.id);
    return true;
  });
}

export function findChaptersForPeriodicTest(subjectId: SubjectId, input: string) {
  const subject = getSubjectById(subjectId);
  if (!subject) {
    return [];
  }

  const numberMatches = Array.from(input.matchAll(/\d+/g)).map((match) => Number(match[0]));
  const byNumber = numberMatches
    .map((chapterNumber) => subject.chapters.find((chapter) => chapter.number === chapterNumber))
    .filter(Boolean) as Chapter[];

  const textTokens = input
    .split(/,|;|\band\b|\n/i)
    .map((item) => normalize(item.replace(/\b(ch|chap|chapter|chp)\b/g, "")))
    .filter((item) => item && !/^\d+$/.test(item));

  const byTitle = textTokens
    .map((token) =>
      subject.chapters.find((chapter) => {
        const title = normalize(chapter.title);
        return title.includes(token) || token.includes(title);
      }),
    )
    .filter(Boolean) as Chapter[];

  return uniqueChapters([...byNumber, ...byTitle]).sort((a, b) => a.number - b.number);
}

function pickBalanced<T>(sources: T[][], count: number) {
  const availableSources = sources.filter((source) => source.length);

  if (!availableSources.length) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    const source = availableSources[index % availableSources.length];
    return source[Math.floor(index / availableSources.length) % source.length];
  });
}

function makeId(prefix: string, setNumber: number, index: number) {
  return `${prefix}-periodic-${setNumber}-${index + 1}`;
}

export function buildPeriodicQuestionPapers(subjectId: SubjectId, chapters: Chapter[], paperCount = 5): QuestionPaper[] {
  if (!chapters.length) {
    return [];
  }

  const normalizedSubjectId = getSubjectById(subjectId)?.id ?? chapters[0].subjectId;

  return Array.from({ length: paperCount }, (_, paperIndex) => {
    const setNumber = paperIndex + 1;
    const sourcePapers = chapters.map((chapter) => {
      const chapterPapers = getQuestionPapers(chapter);
      return chapterPapers[paperIndex % chapterPapers.length];
    });

    const mcqs: McqQuestion[] = pickBalanced(sourcePapers.map((paper) => paper.mcqs), 10).map((question, index) => ({
      ...question,
      id: makeId(`${normalizedSubjectId}-mcq`, setNumber, index),
    }));

    const isMathsPaper = normalizedSubjectId === "maths";

    const matches: MatchQuestion[] = (isMathsPaper ? [] : pickBalanced(sourcePapers.map((paper) => paper.matches), 5)).map((question, index) => ({
      ...question,
      id: makeId(`${normalizedSubjectId}-match`, setNumber, index),
    }));

    const trueFalse: TrueFalseQuestion[] = (isMathsPaper ? [] : pickBalanced(sourcePapers.map((paper) => paper.trueFalse), 7)).map((question, index) => ({
      ...question,
      id: makeId(`${normalizedSubjectId}-tf`, setNumber, index),
    }));

    const blanks: FillBlankQuestion[] = (isMathsPaper ? [] : pickBalanced(sourcePapers.map((paper) => paper.blanks), 8)).map((question, index) => ({
      ...question,
      id: makeId(`${normalizedSubjectId}-blank`, setNumber, index),
    }));

    const shortAnswers: WrittenQuestion[] = (isMathsPaper ? [] : pickBalanced(sourcePapers.map((paper) => paper.shortAnswers), 5)).map((question, index) => ({
      ...question,
      id: makeId(`${normalizedSubjectId}-short`, setNumber, index),
    }));

    const longAnswers: WrittenQuestion[] = (isMathsPaper ? [] : pickBalanced(sourcePapers.map((paper) => paper.longAnswers), 2)).map((question, index) => ({
      ...question,
      id: makeId(`${normalizedSubjectId}-long`, setNumber, index),
    }));

    const practicalQuestions: WrittenQuestion[] = (isMathsPaper ? pickBalanced(sourcePapers.map((paper) => paper.practicalQuestions ?? []), 20) : []).map((question, index) => ({
      ...question,
      id: makeId(`${normalizedSubjectId}-practical`, setNumber, index),
    }));

    return {
      id: `${normalizedSubjectId}-periodic-paper-${setNumber}`,
      chapterId: chapters[0].id,
      setNumber,
      title: `Periodic Test Sample Paper ${setNumber}`,
      mcqs,
      matches,
      trueFalse,
      blanks,
      shortAnswers,
      longAnswers,
      practicalQuestions: isMathsPaper ? practicalQuestions : undefined,
    };
  });
}
