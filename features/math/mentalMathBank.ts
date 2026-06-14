export type MentalMathDifficulty = "easy" | "medium" | "hard";

export type MentalMathQuestion = {
  id: string;
  prompt: string;
  answer: number;
  options: number[];
  hint: string;
  difficulty: MentalMathDifficulty;
  topic: string;
};

function rotate<T>(items: T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

function makeOptions(answer: number, nearby: number[], seed: number) {
  const values = [answer, ...nearby].filter(
    (value, index, items) => Number.isFinite(value) && items.indexOf(value) === index,
  );
  let filler = answer + seed + 3;

  while (values.length < 4) {
    if (!values.includes(filler)) {
      values.push(filler);
    }
    filler += seed % 2 === 0 ? 4 : -5;
  }

  return rotate(values.slice(0, 4), seed % 4);
}

const topics = [
  "Number Play",
  "Fractions",
  "Integers",
  "Perimeter and Area",
  "Patterns",
  "Prime Time",
  "Data Handling",
  "Lines and Angles",
  "Symmetry",
  "Basic Operations",
];

function easyQuestion(index: number): MentalMathQuestion {
  const seed = index + 1;
  const topic = topics[index % topics.length];

  if (index % 8 === 0) {
    const a = 18 + seed * 2;
    const b = 7 + seed;
    const c = 10 + (seed % 9);
    const answer = a + b + c;
    return {
      id: `mental-easy-add-${seed}`,
      prompt: `${a} + ${b} + ${c} = ?`,
      answer,
      options: makeOptions(answer, [answer - 5, answer + 4, answer + 10], seed),
      hint: "Add the pair that makes a round number first.",
      difficulty: "easy",
      topic,
    };
  }

  if (index % 8 === 1) {
    const start = 100 + seed * 3;
    const takeAway = 12 + seed;
    const answer = start - takeAway;
    return {
      id: `mental-easy-subtract-${seed}`,
      prompt: `${start} - ${takeAway} = ?`,
      answer,
      options: makeOptions(answer, [answer - 10, answer + 10, answer + 1], seed),
      hint: "Subtract tens first, then subtract the ones.",
      difficulty: "easy",
      topic,
    };
  }

  if (index % 8 === 2) {
    const number = 6 + seed;
    const answer = number * 5;
    return {
      id: `mental-easy-five-${seed}`,
      prompt: `${number} x 5 = ?`,
      answer,
      options: makeOptions(answer, [answer - 5, answer + 5, answer + 10], seed),
      hint: "Multiply by 10, then take half.",
      difficulty: "easy",
      topic,
    };
  }

  if (index % 8 === 3) {
    const number = 9 + seed;
    const answer = number * 2;
    return {
      id: `mental-easy-double-${seed}`,
      prompt: `Double ${number} = ?`,
      answer,
      options: makeOptions(answer, [answer - 2, answer + 2, answer + 6], seed),
      hint: "Double means add the number to itself.",
      difficulty: "easy",
      topic,
    };
  }

  if (index % 8 === 4) {
    const side = 3 + (seed % 10);
    const answer = side * 4;
    return {
      id: `mental-easy-square-perimeter-${seed}`,
      prompt: `A square has side ${side} cm. What is its perimeter?`,
      answer,
      options: makeOptions(answer, [answer - 4, answer + 4, side * 2], seed),
      hint: "Perimeter of a square is 4 times the side.",
      difficulty: "easy",
      topic,
    };
  }

  if (index % 8 === 5) {
    const term = 5 + seed * 3;
    const answer = term + 3;
    return {
      id: `mental-easy-pattern-${seed}`,
      prompt: `What comes next: ${term - 6}, ${term - 3}, ${term}, ?`,
      answer,
      options: makeOptions(answer, [answer - 3, answer + 3, answer + 6], seed),
      hint: "The pattern is adding 3 each time.",
      difficulty: "easy",
      topic,
    };
  }

  if (index % 8 === 6) {
    const whole = 20 + seed * 2;
    const answer = whole / 2;
    return {
      id: `mental-easy-half-${seed}`,
      prompt: `Half of ${whole} = ?`,
      answer,
      options: makeOptions(answer, [answer - 2, answer + 2, whole], seed),
      hint: "Half means divide into 2 equal parts.",
      difficulty: "easy",
      topic,
    };
  }

  const number = 6 + seed;
  const answer = number * 9;
  return {
    id: `mental-easy-nine-${seed}`,
    prompt: `${number} x 9 = ?`,
    answer,
    options: makeOptions(answer, [answer - 9, answer + 9, answer + 1], seed),
    hint: "For 9 times, multiply by 10 and subtract the number once.",
    difficulty: "easy",
    topic,
  };
}

function mediumQuestion(index: number): MentalMathQuestion {
  const seed = index + 1;
  const topic = topics[(index + 3) % topics.length];

  if (index % 8 === 0) {
    const groups = 4 + seed;
    const answer = groups * 25;
    return {
      id: `mental-medium-quarters-${seed}`,
      prompt: `${groups} groups of 25 = ?`,
      answer,
      options: makeOptions(answer, [answer - 25, answer + 25, answer + 50], seed),
      hint: "Four groups of 25 make 100.",
      difficulty: "medium",
      topic,
    };
  }

  if (index % 8 === 1) {
    const length = 8 + seed;
    const breadth = 3 + (seed % 7);
    const answer = length * breadth;
    return {
      id: `mental-medium-area-${seed}`,
      prompt: `Area of a rectangle ${length} cm x ${breadth} cm = ?`,
      answer,
      options: makeOptions(answer, [answer - length, answer + breadth, length + breadth], seed),
      hint: "Area of a rectangle is length times breadth.",
      difficulty: "medium",
      topic,
    };
  }

  if (index % 8 === 2) {
    const base = 6 + seed;
    const numerator = 2 + (seed % 5);
    const multiplier = 2 + (seed % 4);
    const answer = numerator * multiplier;
    return {
      id: `mental-medium-equivalent-fraction-${seed}`,
      prompt: `${numerator}/${base} = ?/${base * multiplier}`,
      answer,
      options: makeOptions(answer, [answer - multiplier, answer + multiplier, numerator], seed),
      hint: "Multiply the numerator by the same number as the denominator.",
      difficulty: "medium",
      topic,
    };
  }

  if (index % 8 === 3) {
    const start = -8 + seed;
    const move = 6 + (seed % 9);
    const answer = start + move;
    return {
      id: `mental-medium-integer-${seed}`,
      prompt: `On a number line, start at ${start} and move ${move} steps right. Where are you?`,
      answer,
      options: makeOptions(answer, [answer - 2, answer + 2, start - move], seed),
      hint: "Moving right on the number line means adding.",
      difficulty: "medium",
      topic,
    };
  }

  if (index % 8 === 4) {
    const scale = 2 + (seed % 5);
    const bars = 5 + (seed % 8);
    const answer = scale * bars;
    return {
      id: `mental-medium-data-${seed}`,
      prompt: `In a bar graph, 1 block = ${scale} students. ${bars} blocks show how many students?`,
      answer,
      options: makeOptions(answer, [answer - scale, answer + scale, bars], seed),
      hint: "Multiply the number of blocks by the value of one block.",
      difficulty: "medium",
      topic,
    };
  }

  if (index % 8 === 5) {
    const number = 36 + seed * 2;
    const divisor = index % 4 === 1 ? 3 : 2;
    const answer = number / divisor;
    return {
      id: `mental-medium-division-${seed}`,
      prompt: `${number} divided by ${divisor} = ?`,
      answer,
      options: makeOptions(answer, [answer - divisor, answer + divisor, number - answer], seed),
      hint: "Use multiplication tables to divide quickly.",
      difficulty: "medium",
      topic,
    };
  }

  if (index % 8 === 6) {
    const number = 12 + seed;
    const answer = number * 11;
    return {
      id: `mental-medium-eleven-${seed}`,
      prompt: `${number} x 11 = ?`,
      answer,
      options: makeOptions(answer, [answer - 11, answer + 11, number * 10], seed),
      hint: "Multiply by 10, then add the number once more.",
      difficulty: "medium",
      topic,
    };
  }

  const first = 4 + seed;
  const difference = 4 + (seed % 5);
  const answer = first + difference * 4;
  return {
    id: `mental-medium-pattern-${seed}`,
    prompt: `Find the 5th term: ${first}, ${first + difference}, ${first + difference * 2}, ...`,
    answer,
    options: makeOptions(answer, [answer - difference, answer + difference, first + difference * 3], seed),
    hint: "The 5th term is four jumps after the 1st term.",
    difficulty: "medium",
    topic,
  };
}

function hardQuestion(index: number): MentalMathQuestion {
  const seed = index + 1;
  const topic = topics[(index + 6) % topics.length];

  if (index % 8 === 0) {
    const a = 12 + seed;
    const b = 4 + (seed % 7);
    const c = 3 + (seed % 6);
    const answer = a * b - c;
    return {
      id: `mental-hard-multi-step-${seed}`,
      prompt: `${a} x ${b} - ${c} = ?`,
      answer,
      options: makeOptions(answer, [answer - b, answer + c, a + b - c], seed),
      hint: "Multiply first, then subtract.",
      difficulty: "hard",
      topic,
    };
  }

  if (index % 8 === 1) {
    const sideA = 7 + seed;
    const sideB = 4 + (seed % 8);
    const answer = 2 * (sideA + sideB);
    return {
      id: `mental-hard-rectangle-perimeter-${seed}`,
      prompt: `Perimeter of a rectangle ${sideA} cm by ${sideB} cm = ?`,
      answer,
      options: makeOptions(answer, [answer - 2, answer + 4, sideA * sideB], seed),
      hint: "Add length and breadth, then double it.",
      difficulty: "hard",
      topic,
    };
  }

  if (index % 8 === 2) {
    const first = 3 + (seed % 7);
    const second = first + 4;
    const answer = first * second;
    return {
      id: `mental-hard-lcm-multiple-${seed}`,
      prompt: `What is the first common multiple of ${first} and ${second} if they have no common factor except 1?`,
      answer,
      options: makeOptions(answer, [answer - first, answer + second, first + second], seed),
      hint: "When two numbers are co-prime, their first common multiple is their product.",
      difficulty: "hard",
      topic,
    };
  }

  if (index % 8 === 3) {
    const denominator = 9 + (seed % 8);
    const numeratorA = 2 + (seed % 4);
    const numeratorB = 3 + (seed % 5);
    const answer = numeratorA + numeratorB;
    return {
      id: `mental-hard-fraction-add-${seed}`,
      prompt: `${numeratorA}/${denominator} + ${numeratorB}/${denominator} = ?/${denominator}`,
      answer,
      options: makeOptions(answer, [answer - 1, answer + 1, denominator - answer], seed),
      hint: "For like denominators, add only the numerators.",
      difficulty: "hard",
      topic,
    };
  }

  if (index % 8 === 4) {
    const fall = 6 + (seed % 11);
    const rise = 3 + (seed % 9);
    const answer = -fall + rise;
    return {
      id: `mental-hard-integer-change-${seed}`,
      prompt: `Temperature was 0°C. It fell ${fall}°C, then rose ${rise}°C. What is the temperature now?`,
      answer,
      options: makeOptions(answer, [answer - 2, answer + 2, fall - rise], seed),
      hint: "Falling below zero is negative, then add the rise.",
      difficulty: "hard",
      topic,
    };
  }

  if (index % 8 === 5) {
    const value = 15 + seed;
    const answer = value * 6 + value * 4;
    return {
      id: `mental-hard-distributive-${seed}`,
      prompt: `${value} x 6 + ${value} x 4 = ?`,
      answer,
      options: makeOptions(answer, [value * 10 - value, value * 10 + value, value * 6], seed),
      hint: "Use the distributive idea: 6 parts plus 4 parts means 10 parts.",
      difficulty: "hard",
      topic,
    };
  }

  if (index % 8 === 6) {
    const factor = 3 + (seed % 6);
    const number = factor * (8 + seed);
    const answer = number / factor;
    return {
      id: `mental-hard-factor-${seed}`,
      prompt: `${number} is ${factor} times which number?`,
      answer,
      options: makeOptions(answer, [answer - factor, answer + factor, number - factor], seed),
      hint: "Divide the total by the factor.",
      difficulty: "hard",
      topic,
    };
  }

  const first = 5 + seed;
  const jump = 2 + (seed % 5);
  const term = 6;
  const answer = first + jump * (term - 1);
  return {
    id: `mental-hard-nth-pattern-${seed}`,
    prompt: `Find the 6th term: ${first}, ${first + jump}, ${first + jump * 2}, ...`,
    answer,
    options: makeOptions(answer, [answer - jump, answer + jump, first + jump * 4], seed),
    hint: "The 6th term is five jumps after the 1st term.",
    difficulty: "hard",
    topic,
  };
}

export const mentalMathQuestionBank: MentalMathQuestion[] = [
  ...Array.from({ length: 40 }, (_, index) => easyQuestion(index)),
  ...Array.from({ length: 40 }, (_, index) => mediumQuestion(index)),
  ...Array.from({ length: 40 }, (_, index) => hardQuestion(index)),
];
