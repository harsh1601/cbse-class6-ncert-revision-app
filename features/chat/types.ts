export type ChatRole = "student" | "tutor";

export type ChatTutorMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatTutorContext = {
  subjectTitle?: string;
  chapterTitle?: string;
  chapterNumber?: number;
};

