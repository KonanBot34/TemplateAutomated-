const axios = require('axios');

module.exports.config = {
  name: 'Kaizu',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'gimage'],
  description: "Analyze question or Vision",
  usage: "ai [question] or reply to an image",
  credits: 'kaizu',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const promptText = args.join(" ").trim();
  const userReply = event.messageReply?.body || '';
  const finalPrompt = `${userReply} ${promptText}`.trim();
  const senderID = event.senderID;
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!finalPrompt && !event.messageReply?.attachments?.[0]?.url) {
    return api.sendMessage("❌ Please provide a prompt or reply to an image.", threadID, messageID);
  }

  api.sendMessage('ai is nag search sa google...', threadID, async (err, info) => {
    if (err) return;

    try {
      let imageUrl = "";
      if (event.messageReply?.attachments?.[0]?.type === 'photo') {
        imageUrl = event.messageReply.attachments[0].url;
      }

      const { data } = await axios.get("https://apis-rho-nine.vercel.app/gemini", {
        params: {
          ask: finalPrompt,
          imagurl: imageUrl
        }
      });

      const responseText = data.description || "❌ No response received from KAIZU.";

      // Optional: Get user's name
      api.getUserInfo(senderID, (err, infoUser) => {
        const userName = infoUser?.[senderID]?.name || "Unknown User";
        const timePH = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
        const replyMessage = `oten123\\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n🗣 𝗔𝘀𝗸𝗲𝗱 𝗕𝘆: ${userName}\n⏰ 𝗧𝗶𝗺𝗲: ${timePH}`;

        api.editMessage(replyMessage, info.messageID);
      });

    } catch (error) {
      console.error("KAIZU Error:", error);
      const errMsg = "❌ Error: " + (error.response?.data?.message || error.message || "Unknown error occurred.");
      api.editMessage(errMsg, info.messageID);
    }
  });
};
