const fs = require("fs");
const axios = require("axios");
const path = require("path");
const util = require("util");
const unlinkAsync = util.promisify(fs.unlink);

let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json")));
} catch (e) {
  config.prefix = "/";
  config.botName = "My Bot";
}

module.exports.config = {
  name: "prefix",
  version: "1.2.1",
  role: 0,
  description: "Displays the bot's prefix and a GIF.",
  prefix: false,
  premium: false,
  credits: "vern",
  cooldowns: 5,
  category: "info"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const botPrefix = config.prefix || "${botPrefix}";
  const botName = config.botName || "My Bot";
  const gifUrl = "https://media.giphy.com/media/1UwhOK8VX95TcfPBML/giphy.gif";

  const tempFilePath = path.join(__dirname, `prefix_${Date.now()}.gif`);

  try {
    const response = await axios({
      url: gifUrl,
      method: "GET",
      responseType: "stream"
    });

    // Save GIF to temp file
    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Send the message with GIF attachment
    await new Promise((resolve, reject) => {
      api.sendMessage({
        body: `🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍\n📌 🍀𝗣𝗥𝗘𝗙𝗜𝗫: ${botPrefix}\n 🍀𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: ${botName}\n\n 🍀𝗔𝗗𝗠𝗜𝗡 𝗡𝗔𝗠𝗘: ${adminName}\n\n 𝘛𝘩𝘢𝘯𝘬 𝘺𝘰𝘶 𝘧𝘰𝘳 𝘶𝘴𝘪𝘯𝘨 𝘮𝘺 𝘯𝘦𝘸 𝘣𝘰𝘵!`,
        attachment: fs.createReadStream(tempFilePath)
      }, threadID, (err) => {
        if (err) reject(err);
        else resolve();
      }, messageID);
    });

  } catch (error) {
    console.error("Error in prefix command:", error);
    api.sendMessage("⚠️ Failed to fetch or send the GIF.", threadID, messageID);
  } finally {
    // Clean up the temp file asynchronously
    unlinkAsync(tempFilePath).catch(e => {/* ignore */});
  }
};
