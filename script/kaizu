module.exports.config = {
  name: "Kaizuz Dev",
  version: "1.0.0",
  credits: "vern",
  description: "A simple command that sends a greeting message.",
  commandCategory: "General",
  usages: "[optional message]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  try {
    const msg = args.length ? args.join(" ") : "Hoy wag mo i mention ang aking owner dahil siya ay busy";
    return api.sendMessage(msg, event.threadID);
  } catch (err) {
    console.error(err);
  }
};
