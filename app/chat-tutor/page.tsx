import { ChatTutorClient } from "@/features/chat/ChatTutorClient";
import { class6Subjects, getChapterById } from "@/features/biology/content";

export default async function ChatTutorPage({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  const { chapter: chapterId } = await searchParams;
  const chapter = chapterId ? getChapterById(chapterId) : undefined;
  const subject = chapter ? class6Subjects.find((item) => item.id === chapter.subjectId) : undefined;

  return (
    <ChatTutorClient
      context={
        chapter
          ? {
              subjectTitle: subject?.title,
              chapterTitle: chapter.title,
              chapterNumber: chapter.number,
            }
          : undefined
      }
    />
  );
}
