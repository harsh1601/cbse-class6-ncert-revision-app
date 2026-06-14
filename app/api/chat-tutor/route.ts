import { NextResponse } from "next/server";
import { createMockTutorAnswer, hasUnsafeContent, shouldRedirectToStudies } from "@/features/chat/mockTutor";
import { buildContextLine, toProviderMessages } from "@/features/chat/tutorPrompt";
import type { ChatTutorContext, ChatTutorMessage } from "@/features/chat/types";

export const runtime = "nodejs";

const maxMessages = 12;
const maxQuestionLength = 600;

type ChatTutorRequest = {
  messages?: ChatTutorMessage[];
  context?: ChatTutorContext;
};

function sanitizeMessages(messages: unknown): ChatTutorMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message): message is ChatTutorMessage => {
      if (!message || typeof message !== "object") {
        return false;
      }

      const candidate = message as Partial<ChatTutorMessage>;
      return (candidate.role === "student" || candidate.role === "tutor") && typeof candidate.content === "string";
    })
    .map((message) => ({
      ...message,
      content: message.content.slice(0, maxQuestionLength),
    }))
    .slice(-maxMessages);
}

function extractProviderAnswer(data: unknown) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const payload = data as {
    choices?: Array<{ message?: { content?: string } }>;
    output_text?: string;
    text?: string;
  };

  return payload.choices?.[0]?.message?.content ?? payload.output_text ?? payload.text ?? "";
}

async function askConfiguredAi(messages: ChatTutorMessage[], context?: ChatTutorContext) {
  const apiUrl = process.env.AI_TUTOR_API_URL;
  const apiKey = process.env.AI_TUTOR_API_KEY;
  const model = process.env.AI_TUTOR_MODEL;

  if (!apiUrl || !apiKey || !model) {
    return "";
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: toProviderMessages(messages, context),
      temperature: 0.45,
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI tutor provider failed with ${response.status}`);
  }

  return extractProviderAnswer(await response.json()).trim();
}

export async function POST(request: Request) {
  let body: ChatTutorRequest;

  try {
    body = (await request.json()) as ChatTutorRequest;
  } catch {
    return NextResponse.json({ answer: "Please type a study question so I can help you." }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== "student" || !lastMessage.content.trim()) {
    return NextResponse.json({ answer: "Please type a study question so I can help you." }, { status: 400 });
  }

  if (hasUnsafeContent(lastMessage.content)) {
    return NextResponse.json({
      answer: "I cannot help with unsafe or inappropriate content. I am here to help you learn. Please ask me a Class 6 study question.",
      source: "safety",
    });
  }

  if (shouldRedirectToStudies(lastMessage.content)) {
    return NextResponse.json({
      answer: "I am here to help you with your studies. Please ask me a subject-related question from Maths, Science, English, Hindi, SST, or revision topics.",
      source: "study-guardrail",
    });
  }

  try {
    const providerAnswer = await askConfiguredAi(messages, body.context);

    if (providerAnswer) {
      return NextResponse.json({ answer: providerAnswer, source: "ai" });
    }
  } catch (error) {
    console.error("Chat Tutor AI provider error", error);
    return NextResponse.json({
      answer: "Sorry, I am unable to answer right now. Please try again after some time.",
      source: "error",
    });
  }

  return NextResponse.json({
    answer: createMockTutorAnswer(messages, body.context),
    context: buildContextLine(body.context),
    source: "mock",
  });
}

