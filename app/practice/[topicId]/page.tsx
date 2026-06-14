import { notFound } from "next/navigation";
import { getChapterById } from "@/features/biology/content";
import { PracticeClient } from "@/features/practice/PracticeClient";

export default async function PracticePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const chapter = getChapterById(topicId);

  if (!chapter) {
    notFound();
  }

  return <PracticeClient chapter={chapter} />;
}
