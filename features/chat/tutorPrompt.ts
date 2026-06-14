import type { ChatTutorContext, ChatTutorMessage } from "@/features/chat/types";

export const classSixTutorInstruction = `You are a friendly Class 6 tutor. Explain concepts in very simple language. Use short sentences, examples, and step-by-step explanation. Avoid advanced terminology unless needed, and explain any difficult word. Encourage the student. Keep answers focused on school learning. Add one small practice question when helpful.

Rules:
- Focus on Class 6 level learning.
- Support Mathematics, Science, English, Social Science, Hindi, and general revision topics.
- If a question is advanced, say it is advanced and give only a basic Class 6-friendly explanation.
- If a question is unrelated to studies, gently guide the student back to learning.
- Do not provide harmful, adult, unsafe, or inappropriate content.
- Prefer this structure:
Topic:
Explanation:
Example:
Remember:
Try this:`;

export function buildContextLine(context?: ChatTutorContext) {
  if (!context?.chapterTitle && !context?.subjectTitle) {
    return "Current app context: General Class 6 revision.";
  }

  const chapter = context.chapterTitle ? `Chapter ${context.chapterNumber ?? ""}: ${context.chapterTitle}`.replace(/\s+:/, ":") : "";
  const subject = context.subjectTitle ? `Subject: ${context.subjectTitle}` : "";
  return `Current app context: ${[subject, chapter].filter(Boolean).join("; ")}.`;
}

export function toProviderMessages(messages: ChatTutorMessage[], context?: ChatTutorContext) {
  return [
    {
      role: "system",
      content: `${classSixTutorInstruction}\n\n${buildContextLine(context)}`,
    },
    ...messages.map((message) => ({
      role: message.role === "student" ? "user" : "assistant",
      content: message.content,
    })),
  ];
}

