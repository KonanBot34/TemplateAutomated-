// quizData.js (optional external file for cleaner separation)
// You can move this into your main command file if needed.

const quizData = [
  {
    question: "What is the value of 7 × 8?",
    category: "Mathematics",
    difficulty: "easy",
    choices: ["A. 54", "B. 56", "C. 64", "D. 58"],
    answer: "B"
  },
  {
    question: "What is the square root of 144?",
    category: "Mathematics",
    difficulty: "medium",
    choices: ["A. 10", "B. 11", "C. 12", "D. 14"],
    answer: "C"
  },
  {
    question: "What is 15% of 200?",
    category: "Mathematics",
    difficulty: "medium",
    choices: ["A. 25", "B. 20", "C. 35", "D. 30"],
    answer: "D"
  },
  {
    question: "Solve for x: 2x + 3 = 11",
    category: "Mathematics",
    difficulty: "medium",
    choices: ["A. 4", "B. 6", "C. 8", "D. 2"],
    answer: "A"
  }
];

module.exports.config = {
  name: "math",
  version: "1.0.1",
  role: 0,
  credits: "kaizu",
  aliases: ["math quiz", "m quiz", "m q"], 
  description: "Answer a quiz directly with quiz A/B/C/D",
  usages: "[A/B/C/D] or no args to get question",
  cooldowns: 3,
  hasPrefix: true
};

const activeQuiz = {}; // To store question per user/thread

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const input = args[0]?.toUpperCase();

  // Check if user is answering
  if (input && input.startsWith("QUIZ")) {
    const answerLetter = input.split(" ")[1]?.toUpperCase();
    const current = activeQuiz[senderID];
    if (!current) {
      return api.sendMessage("❗ You haven't been given a question yet. Type `math` to get one.", threadID, messageID);
    }

    const correct = current.answer === answerLetter;
    const response = correct
      ? "🎉 Correct!"
      : `❌ Incorrect! The correct answer was ${current.answer}.`;

    delete activeQuiz[senderID]; // Remove question after answer
    return api.sendMessage(response, threadID, messageID);
  }

  // Give new question
  const random = quizData[Math.floor(Math.random() * quizData.length)];
  activeQuiz[senderID] = random;

  const questionText = `
🧠 𝗤𝘂𝗶𝘇 𝗧𝗶𝗺𝗲!
══════════════
📌 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${random.question}
🎯 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${random.category}
📈 𝗗𝗶𝗳𝗳𝗶𝗰𝘂𝗹𝘁𝘆: ${random.difficulty}
══════════════
${random.choices.join("\n")}
══════════════
✅ Answer by typing: quiz A / quiz B / quiz C / quiz D
`.trim();

  return api.sendMessage(questionText, threadID, messageID);
};