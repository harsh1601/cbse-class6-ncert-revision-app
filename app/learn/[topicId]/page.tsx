import { notFound } from "next/navigation";
import { getChapterById } from "@/features/biology/content";
import { LearnClient } from "@/features/learning/LearnClient";

export default async function LearnPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const chapter = getChapterById(topicId);

  if (!chapter) {
    notFound();
  }

  return <LearnClient chapter={chapter} />;
}
