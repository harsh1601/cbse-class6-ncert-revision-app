import type { Chapter, QuestionPaper, WrittenQuestion } from "@/features/biology/content";

type PdfText = {
  text: string;
  x: number;
  y: number;
  size: number;
  font: "regular" | "bold";
};

type PdfLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type PdfPage = {
  texts: PdfText[];
  lines: PdfLine[];
};

const pageWidth = 595;
const pageHeight = 842;
const margin = 42;
const contentWidth = pageWidth - margin * 2;

function cleanFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(value: string, maxLength = 86) {
  if (!value.trim()) {
    return [""];
  }

  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function centeredX(text: string, size: number) {
  return Math.max(margin, (pageWidth - text.length * size * 0.52) / 2);
}

class PageWriter {
  private pages: PdfPage[] = [];
  private current: PdfPage = { texts: [], lines: [] };
  private y = 792;

  constructor(private readonly header: string, private readonly subheader: string) {
    this.startPage();
  }

  private startPage() {
    this.current = { texts: [], lines: [] };
    this.pages.push(this.current);
    this.y = 792;
    this.addCentered(this.header, 14, "bold", 18);
    this.addCentered(this.subheader, 10, "regular", 12);
    this.line(42, this.y, 553, this.y);
    this.y -= 20;
  }

  private ensureSpace(required = 28) {
    if (this.y - required < 64) {
      this.startPage();
    }
  }

  addText(text: string, size = 10, font: "regular" | "bold" = "regular", indent = 0, gapAfter = 12) {
    const maxLength = Math.max(40, Math.floor((contentWidth - indent) / (size * 0.52)));
    const lines = wrapText(text, maxLength);
    this.ensureSpace(lines.length * (size + 4) + gapAfter);

    for (const line of lines) {
      this.current.texts.push({ text: line, x: margin + indent, y: this.y, size, font });
      this.y -= size + 4;
    }

    this.y -= Math.max(0, gapAfter - 8);
  }

  addCentered(text: string, size = 12, font: "regular" | "bold" = "bold", gapAfter = 12) {
    this.ensureSpace(size + gapAfter);
    this.current.texts.push({ text, x: centeredX(text, size), y: this.y, size, font });
    this.y -= size + gapAfter;
  }

  addSection(title: string, marks: string) {
    this.ensureSpace(42);
    this.y -= 4;
    this.current.lines.push({ x1: margin, y1: this.y + 13, x2: 553, y2: this.y + 13 });
    this.current.texts.push({ text: `${title} (${marks})`, x: margin, y: this.y, size: 11, font: "bold" });
    this.y -= 20;
  }

  addAnswerSpace(lines = 1) {
    for (let index = 0; index < lines; index += 1) {
      this.ensureSpace(18);
      this.current.lines.push({ x1: margin + 18, y1: this.y, x2: 553, y2: this.y });
      this.y -= 18;
    }
    this.y -= 2;
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    this.current.lines.push({ x1, y1, x2, y2 });
  }

  blank(space = 12) {
    this.ensureSpace(space);
    this.y -= space;
  }

  getPages() {
    return this.pages;
  }
}

function pageToStream(page: PdfPage, pageNumber: number, pageCount: number) {
  const textOps = page.texts
    .map((item) => `BT /${item.font === "bold" ? "F2" : "F1"} ${item.size} Tf ${item.x} ${item.y} Td (${escapePdfText(item.text)}) Tj ET`)
    .join("\n");
  const lineOps = page.lines.map((item) => `${item.x1} ${item.y1} m ${item.x2} ${item.y2} l S`).join("\n");
  const footer = `BT /F1 8 Tf 274 32 Td (Page ${pageNumber} of ${pageCount}) Tj ET`;

  return [lineOps, textOps, footer].filter(Boolean).join("\n");
}

function createPdf(pages: PdfPage[]) {
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("PAGES_PLACEHOLDER");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pages.forEach((page, index) => {
    const pageId = objects.length + 1;
    const contentId = pageId + 1;
    pageObjectIds.push(pageId);
    const stream = pageToStream(page, index + 1, pages.length);

    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function pickAcross<T>(papers: QuestionPaper[], picker: (paper: QuestionPaper) => T[], count: number) {
  const sources = papers.map(picker).filter((items) => items.length);

  if (!sources.length) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    const items = sources[index % sources.length];
    return items[Math.floor(index / sources.length) % items.length];
  });
}

function mixedQuestionSet(papers: QuestionPaper[]) {
  return {
    mcqs: pickAcross(papers, (paper) => paper.mcqs, 10),
    matches: pickAcross(papers, (paper) => paper.matches, 5),
    trueFalse: pickAcross(papers, (paper) => paper.trueFalse, 7),
    blanks: pickAcross(papers, (paper) => paper.blanks, 8),
    shortAnswers: pickAcross(papers, (paper) => paper.shortAnswers, 5),
    longAnswers: pickAcross(papers, (paper) => paper.longAnswers, 2),
    practicalQuestions: pickAcross(papers, (paper) => paper.practicalQuestions ?? [], 20),
  };
}

function addMcqSection(writer: PageWriter, questions: QuestionPaper["mcqs"]) {
  writer.addSection("Section A: Multiple Choice Questions", "10 x 1 = 10 marks");
  questions.forEach((question, index) => {
    writer.addText(`${index + 1}. ${question.prompt}`, 10, "bold", 0, 6);
    writer.addText(`A. ${question.options[0]}        B. ${question.options[1]}`, 9, "regular", 14, 4);
    writer.addText(`C. ${question.options[2]}        D. ${question.options[3]}`, 9, "regular", 14, 10);
  });
}

function addStandardQuestionSections(writer: PageWriter, paper: ReturnType<typeof mixedQuestionSet>) {
  addMcqSection(writer, paper.mcqs);
  writer.addSection("Section B: Match the Following", "5 x 1 = 5 marks");
  paper.matches.forEach((question, index) => {
    writer.addText(`${index + 1}. ${question.left}  ->  ______________________________________________`, 10, "regular", 0, 8);
  });

  writer.addSection("Section C: True or False", "7 x 1 = 7 marks");
  paper.trueFalse.forEach((question, index) => {
    writer.addText(`${index + 1}. ${question.statement}        True / False`, 10, "regular", 0, 8);
  });

  writer.addSection("Section D: Fill in the Blanks", "8 x 1 = 8 marks");
  paper.blanks.forEach((question, index) => {
    writer.addText(`${index + 1}. ${question.prompt}`, 10, "regular", 0, 8);
  });

  writer.addSection("Section E: Short Answer Questions", "5 x 2 = 10 marks");
  paper.shortAnswers.forEach((question, index) => {
    writer.addText(`${index + 1}. ${question.prompt}`, 10, "bold", 0, 8);
    writer.addAnswerSpace(3);
  });

  writer.addSection("Section F: Long Answer Questions", "2 x 5 = 10 marks");
  paper.longAnswers.forEach((question, index) => {
    writer.addText(`${index + 1}. ${question.prompt}`, 10, "bold", 0, 8);
    writer.addAnswerSpace(6);
  });
}

function addMathsQuestionSections(writer: PageWriter, mcqs: QuestionPaper["mcqs"], practicalQuestions: WrittenQuestion[]) {
  addMcqSection(writer, mcqs);

  writer.addSection("Section B: Practical/Application Questions", "20 x 2 = 40 marks");
  practicalQuestions.forEach((question, index) => {
    writer.addText(`${index + 1}. ${question.prompt}`, 10, "bold", 0, 8);
    writer.addAnswerSpace(4);
  });
}

function addQuestionPaperPages(chapter: Chapter, papers: QuestionPaper[]) {
  const mixed = mixedQuestionSet(papers);
  const writer = new PageWriter("CBSE Class 6 NCERT Revision App", "School Sample Question Paper");

  writer.addCentered(chapter.bookTitle, 12, "bold", 8);
  writer.addCentered(`Chapter ${chapter.number}: ${chapter.title}`, 11, "regular", 12);
  writer.addText(`Mixed from Practice Papers 1 to ${papers.length}`, 10, "bold", 0, 8);
  writer.addText("Time: 2 Hours                                      Maximum Marks: 50", 10, "bold", 0, 10);
  writer.addText("Name: ____________________________     Roll No.: ____________     Date: ____________", 10, "regular", 0, 12);
  writer.addText("General Instructions:", 10, "bold", 0, 5);
  writer.addText("1. Read all questions carefully.  2. Write answers neatly.  3. Answer sheet is provided only at the end of this PDF.", 9, "regular", 12, 14);

  if (chapter.subjectId === "maths") {
    writer.addText("Maths format: 10 MCQs and 20 practical/application questions only.", 9, "bold", 0, 12);
    addMathsQuestionSections(writer, mixed.mcqs, mixed.practicalQuestions);
  } else {
    addStandardQuestionSections(writer, mixed);
  }

  return { pages: writer.getPages(), mixed };
}

function addWrittenHints(writer: PageWriter, questions: WrittenQuestion[], startIndex: number) {
  questions.forEach((question, index) => {
    writer.addText(`${startIndex + index}. ${question.prompt}`, 10, "bold", 0, 5);
    writer.addText(`Model answer: ${question.modelAnswer}`, 9, "regular", 14, 5);
    writer.addText(`Key points: ${question.keyPoints.join("; ")}`, 9, "regular", 14, 10);
  });
}

function addAnswerPages(chapter: Chapter, papers: QuestionPaper[]) {
  const mixed = mixedQuestionSet(papers);
  const writer = new PageWriter("CBSE Class 6 NCERT Revision App", "Answer Sheet");

  writer.addCentered(`${chapter.bookTitle} - Chapter ${chapter.number}: ${chapter.title}`, 11, "bold", 12);
  writer.addText("Answer key for the mixed sample paper. Use this section after completing the question paper.", 10, "regular", 0, 16);

  writer.addSection("Section A: MCQ Answers", "10 marks");
  mixed.mcqs.forEach((question, index) => writer.addText(`${index + 1}. ${question.correctAnswer}`, 10, "regular", 0, 5));

  if (chapter.subjectId === "maths") {
    writer.addSection("Section B: Practical/Application Answer Hints", "40 marks");
    addWrittenHints(writer, mixed.practicalQuestions, 1);
    return writer.getPages();
  }

  writer.addSection("Section B: Match the Following", "5 marks");
  mixed.matches.forEach((question, index) => writer.addText(`${index + 1}. ${question.left} - ${question.right}`, 10, "regular", 0, 5));

  writer.addSection("Section C: True or False", "7 marks");
  mixed.trueFalse.forEach((question, index) => writer.addText(`${index + 1}. ${question.correctAnswer ? "True" : "False"} - ${question.explanation}`, 10, "regular", 0, 5));

  writer.addSection("Section D: Fill in the Blanks", "8 marks");
  mixed.blanks.forEach((question, index) => writer.addText(`${index + 1}. ${question.correctAnswer}`, 10, "regular", 0, 5));

  writer.addSection("Section E: Short Answer Hints", "10 marks");
  addWrittenHints(writer, mixed.shortAnswers, 1);

  writer.addSection("Section F: Long Answer Hints", "10 marks");
  addWrittenHints(writer, mixed.longAnswers, 1);

  return writer.getPages();
}

export type SchoolPaperMeta = {
  title: string;
  subtitle: string;
  sourceLine: string;
  fileName: string;
};

function addSingleQuestionPaperPages(meta: SchoolPaperMeta, paper: QuestionPaper) {
  const writer = new PageWriter("CBSE Class 6 NCERT Revision App", "School Sample Question Paper");

  writer.addCentered(meta.title, 12, "bold", 8);
  writer.addCentered(meta.subtitle, 11, "regular", 12);
  writer.addText(meta.sourceLine, 10, "bold", 0, 8);
  writer.addText("Time: 2 Hours                                      Maximum Marks: 50", 10, "bold", 0, 10);
  writer.addText("Name: ____________________________     Roll No.: ____________     Date: ____________", 10, "regular", 0, 12);
  writer.addText("General Instructions:", 10, "bold", 0, 5);
  writer.addText("1. Read all questions carefully.  2. Write answers neatly.  3. Answer sheet is provided only at the end of this PDF.", 9, "regular", 12, 14);

  if (paper.practicalQuestions?.length) {
    writer.addText("Maths format: 10 MCQs and 20 practical/application questions only.", 9, "bold", 0, 12);
    addMathsQuestionSections(writer, paper.mcqs, paper.practicalQuestions);
  } else {
    addStandardQuestionSections(writer, { ...paper, practicalQuestions: [] });
  }

  return writer.getPages();
}

function addSingleAnswerPages(meta: SchoolPaperMeta, paper: QuestionPaper) {
  const writer = new PageWriter("CBSE Class 6 NCERT Revision App", "Answer Sheet");

  writer.addCentered(meta.title, 11, "bold", 8);
  writer.addCentered(meta.subtitle, 10, "regular", 12);
  writer.addText("Answer key for the sample paper. Use this section after completing the question paper.", 10, "regular", 0, 16);

  writer.addSection("Section A: MCQ Answers", "10 marks");
  paper.mcqs.forEach((question, index) => writer.addText(`${index + 1}. ${question.correctAnswer}`, 10, "regular", 0, 5));

  if (paper.practicalQuestions?.length) {
    writer.addSection("Section B: Practical/Application Answer Hints", "40 marks");
    addWrittenHints(writer, paper.practicalQuestions, 1);
    return writer.getPages();
  }

  writer.addSection("Section B: Match the Following", "5 marks");
  paper.matches.forEach((question, index) => writer.addText(`${index + 1}. ${question.left} - ${question.right}`, 10, "regular", 0, 5));

  writer.addSection("Section C: True or False", "7 marks");
  paper.trueFalse.forEach((question, index) => writer.addText(`${index + 1}. ${question.correctAnswer ? "True" : "False"} - ${question.explanation}`, 10, "regular", 0, 5));

  writer.addSection("Section D: Fill in the Blanks", "8 marks");
  paper.blanks.forEach((question, index) => writer.addText(`${index + 1}. ${question.correctAnswer}`, 10, "regular", 0, 5));

  writer.addSection("Section E: Short Answer Hints", "10 marks");
  addWrittenHints(writer, paper.shortAnswers, 1);

  writer.addSection("Section F: Long Answer Hints", "10 marks");
  addWrittenHints(writer, paper.longAnswers, 1);

  return writer.getPages();
}

export function downloadSchoolQuestionPaperPdf(meta: SchoolPaperMeta, paper: QuestionPaper) {
  const questionPages = addSingleQuestionPaperPages(meta, paper);
  const answerPages = addSingleAnswerPages(meta, paper);
  const blob = new Blob([createPdf([...questionPages, ...answerPages])], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cleanFileName(meta.fileName)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadMixedSamplePaperPdf(chapter: Chapter, papers: QuestionPaper[]) {
  const { pages: questionPages } = addQuestionPaperPages(chapter, papers);
  const answerPages = addAnswerPages(chapter, papers);
  const blob = new Blob([createPdf([...questionPages, ...answerPages])], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cleanFileName(chapter.title)}-school-sample-paper.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
