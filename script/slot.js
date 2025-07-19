const axios = require("axios")

module.exports.config = {
  name: "slot",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "kung boring ka gamitin mo ito.",
  usage: "slot",
  credits: "kaizu",
  cooldown: 4,
};

function getSlotResult() {
  const symbols = ["🍀", "🦝", "😤"];
  const slot = [0, 0, 0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  let resultText = `🎰 Resulta: |${slot.join('|')}|`;

  if (slot.every(s => s === "🍀")) {
    resultText += "\n🎉 JACKPOT! ×10 sa iyong taya!";
  } else if (new Set(slot).size <= 2) {
    resultText += "\n✅ Panalo ka! ×2 sa iyong taya!";
  } else if (slot.join('') === "🍀🦝😤") {
    resultText += "\n❌ Talong pattern. Maswerte sa susunod!";
  } else {
    resultText += "\n❌ Talo ka. Maswerte sa susunod!";
  }

  return resultText;
}

module.exports = getSlotResult;