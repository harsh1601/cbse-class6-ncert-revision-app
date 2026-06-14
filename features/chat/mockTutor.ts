import type { ChatTutorContext, ChatTutorMessage } from "@/features/chat/types";

type TopicAnswer = {
  topic: string;
  explanation: string;
  example: string;
  remember: string[];
  tryThis: string;
};

const topicAnswers: TopicAnswer[] = [
  {
    topic: "Fractions",
    explanation: "A fraction shows a part of a whole. The top number tells how many parts we have. The bottom number tells how many equal parts the whole is divided into.",
    example: "If a roti is cut into 4 equal parts and you eat 1 part, you ate 1/4 of the roti.",
    remember: ["The top number is called the numerator.", "The bottom number is called the denominator.", "The parts must be equal."],
    tryThis: "If a chocolate has 8 equal pieces and you eat 3 pieces, what fraction did you eat?",
  },
  {
    topic: "Photosynthesis",
    explanation: "Photosynthesis is the process by which green plants make their own food using sunlight, water, carbon dioxide, and chlorophyll.",
    example: "A plant takes water from the soil and carbon dioxide from the air. With sunlight, its leaves prepare food.",
    remember: ["Leaves are the main place where photosynthesis happens.", "Sunlight and chlorophyll are needed.", "Oxygen is released during this process."],
    tryThis: "What gas do plants take from the air during photosynthesis?",
  },
  {
    topic: "Prime Numbers",
    explanation: "A prime number is a number greater than 1 that has exactly two factors: 1 and itself.",
    example: "7 is prime because only 1 and 7 divide it exactly. 9 is not prime because 1, 3, and 9 divide it.",
    remember: ["1 is not a prime number.", "2 is the smallest prime number.", "A composite number has more than two factors."],
    tryThis: "Is 11 a prime number? Write why.",
  },
  {
    topic: "Water Cycle",
    explanation: "The water cycle is the journey of water from Earth to the sky and back again.",
    example: "Sun heats water and it becomes water vapour. Clouds form. Then rain brings water back to Earth.",
    remember: ["Evaporation means water changes into vapour.", "Condensation helps clouds form.", "Precipitation means rain, snow, or hail falls."],
    tryThis: "Which step of the water cycle forms clouds?",
  },
  {
    topic: "Active and Passive Voice",
    explanation: "In active voice, the doer of the action comes first. In passive voice, the receiver of the action comes first.",
    example: "Active: Riya kicked the ball. Passive: The ball was kicked by Riya.",
    remember: ["Active voice is usually direct.", "Passive voice focuses on the thing receiving the action.", "Look for who is doing the action."],
    tryThis: "Change this to passive voice: Aman opened the door.",
  },
  {
    topic: "Perimeter and Area",
    explanation: "Perimeter is the distance around a shape. Area is the surface covered inside the shape.",
    example: "Fencing a garden uses perimeter. Tiling a floor uses area.",
    remember: ["Perimeter uses length units like cm or m.", "Area uses square units like square cm or square m.", "Do not mix boundary and surface."],
    tryThis: "A square has side 5 cm. What is its perimeter?",
  },
  {
    topic: "Symmetry",
    explanation: "Symmetry means a shape or design has balanced matching parts.",
    example: "A butterfly picture often has line symmetry because both wings look like matching halves.",
    remember: ["A line of symmetry divides a figure into matching halves.", "Folding can help test line symmetry.", "Some designs also match after turning."],
    tryThis: "How many lines of symmetry does a rectangle have?",
  },
  {
    topic: "Integers",
    explanation: "Integers are whole numbers that include positive numbers, negative numbers, and zero.",
    example: "Temperature can be -2 degrees, 0 degrees, or 5 degrees. All of these are integers.",
    remember: ["Negative numbers are less than zero.", "Positive numbers are greater than zero.", "On a number line, numbers increase as we move right."],
    tryThis: "Which is greater: -3 or -7?",
  },
  {
    topic: "Maps",
    explanation: "A map is a drawing of an area from above. It helps us locate places and understand directions.",
    example: "A school map can show the classroom, library, playground, and gate.",
    remember: ["Direction helps us find north, south, east, and west.", "Symbols show important places.", "Scale connects map distance with real distance."],
    tryThis: "What does a map symbol help us show?",
  },
  {
    topic: "Hindi Grammar",
    explanation: "Hindi grammar helps us use words and sentences correctly. It includes sangya, sarvanam, kriya, vachan, ling, and kaal.",
    example: "In the sentence 'Ravi khel raha hai', Ravi is sangya and khel raha hai tells the action.",
    remember: ["Sangya means noun.", "Kriya means action word.", "Read the full sentence before identifying grammar."],
    tryThis: "Find the kriya in this sentence: Meena gaana gaati hai.",
  },
];

const studyWords = [
  "active",
  "angle",
  "area",
  "chapter",
  "civics",
  "data",
  "democracy",
  "english",
  "explain",
  "factor",
  "fraction",
  "grammar",
  "hindi",
  "history",
  "integer",
  "map",
  "math",
  "number",
  "passive",
  "photosynthesis",
  "prime",
  "science",
  "sst",
  "study",
  "symmetry",
  "water",
  "why",
];

const unsafeWords = ["adult", "drugs", "hack", "kill", "password", "porn", "sex", "weapon"];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}

function isFollowUp(question: string) {
  return /\b(again|another|more|it|this|that|same topic|example)\b/i.test(question);
}

function previousStudentQuestion(messages: ChatTutorMessage[]) {
  return [...messages]
    .reverse()
    .find((message) => message.role === "student" && !isFollowUp(message.content))?.content;
}

function findAnswer(question: string, context?: ChatTutorContext) {
  const search = normalize(`${question} ${context?.chapterTitle ?? ""} ${context?.subjectTitle ?? ""}`);

  return (
    topicAnswers.find((answer) => search.includes(normalize(answer.topic))) ??
    topicAnswers.find((answer) => normalize(answer.topic).split(" ").some((word) => word.length > 4 && search.includes(word))) ??
    null
  );
}

function formatAnswer(answer: TopicAnswer, prefix = "Good question!") {
  return `${prefix} Let us understand this slowly.

Topic: ${answer.topic}

Explanation:
${answer.explanation}

Example:
${answer.example}

Remember:
${answer.remember.map((point) => `- ${point}`).join("\n")}

Try this:
${answer.tryThis}`;
}

function generalStudyAnswer(question: string, context?: ChatTutorContext) {
  const topic = context?.chapterTitle || question.replace(/[?.!]+$/g, "").slice(0, 60) || "Your doubt";

  return `Good question! Let us break it into small steps.

Topic: ${topic}

Explanation:
This looks like a Class 6 learning doubt. Start by finding the main word in the question. Then connect it with one simple example from daily life.

Example:
If the topic is from Maths, write the given numbers first. If it is from Science or SST, write what is happening, where it happens, and why it is useful.

Remember:
- Read the question slowly.
- Underline the important words.
- Explain the idea in your own words.

Try this:
Can you tell me the exact word or step that is confusing?`;
}

export function shouldRedirectToStudies(question: string) {
  const normalized = normalize(question);
  const hasStudyWord = studyWords.some((word) => normalized.includes(word));
  const looksLikeLearningQuestion = /\b(what|why|how|explain|meaning|example|define|solve|understand)\b/.test(normalized);
  const looksEntertainmentOnly = /\b(movie|game|instagram|youtube|song|celebrity|shopping)\b/.test(normalized);

  return looksEntertainmentOnly && !hasStudyWord && !looksLikeLearningQuestion;
}

export function hasUnsafeContent(question: string) {
  const normalized = normalize(question);
  return unsafeWords.some((word) => normalized.includes(word));
}

export function createMockTutorAnswer(messages: ChatTutorMessage[], context?: ChatTutorContext) {
  const currentQuestion = messages[messages.length - 1]?.content ?? "";

  if (hasUnsafeContent(currentQuestion)) {
    return "I cannot help with unsafe or inappropriate content. I am here to help you learn. Please ask me a Class 6 study question.";
  }

  if (shouldRedirectToStudies(currentQuestion)) {
    return "I am here to help you with your studies. Please ask me a subject-related question from Maths, Science, English, Hindi, SST, or revision topics.";
  }

  const questionForTopic = isFollowUp(currentQuestion) ? previousStudentQuestion(messages.slice(0, -1)) ?? currentQuestion : currentQuestion;
  const answer = findAnswer(questionForTopic, context);

  if (answer) {
    return formatAnswer(answer, isFollowUp(currentQuestion) ? "Of course!" : "Good question!");
  }

  return generalStudyAnswer(currentQuestion, context);
}

