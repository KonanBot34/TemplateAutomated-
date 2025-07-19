 const axios = require('axios');

let fontEnabled = true;

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };
  return [...text].map(char => fontEnabled && fontMapping[char] ? fontMapping[char] : char).join('');
}

module.exports.config = {
  name: 'kaizu',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['g3n', 'gemma3n'],
  description: "Talk with Gemma 3n AI model",
  usage: "gemma [your message]",
  credits: 'Ry',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ").trim();
  const senderID = event.senderID;
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!prompt) {
    return api.sendMessage(formatFont("❌ Please enter a message to send to Gemma."), threadID, messageID);
  }

  api.sendMessage(formatFont("🤖 𝗞𝗔𝗜𝗭𝗨 𝗜𝗦 𝗧𝗛𝗜𝗡𝗞𝗜𝗡𝗚..."), threadID, async (err, info) => {
    if (err) return;

    try {
      const { data } = await axios.get("https://wildan-suldyir-apis.vercel.app/api/gemma-3n-e4b", {
        params: { prompt }
      });

      const responseText = data?.response || "❌ No response from Gemma AI.";

      api.getUserInfo(senderID, (err, infoUser) => {
        const userName = infoUser?.[senderID]?.name || "Unknown User";
        const timePH = new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleString('en-US', { hour12: false });

        const replyMessage = `
🤖 𝗞𝗔𝗜𝗭𝗨 𝗕𝗢𝗧𝗭☆
━━━━━━━━━━━━━━━━━━
${responseText.trim()}
━━━━━━━━━━━━━━━━━━
🗣 𝗔𝘀𝗸𝗲𝗱 𝗕𝘆: ${userName}
⏰ 𝗧𝗶𝗺𝗲: ${timePH}`.trim();

        api.editMessage(formatFont(replyMessage), info.messageID);
      });

    } catch (error) {
      console.error("Gemma API Error:", error);
      const errMsg = "❌ Error: " + (error.response?.data?.message || error.message || "Unknown error.");
      api.editMessage(formatFont(errMsg), info.messageID);
    }
  });
};
