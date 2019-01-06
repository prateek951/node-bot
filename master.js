require("dotenv").config();
const TELEGRAF = require("telegraf");
const bot = new TELEGRAF(process.env.TELEGRAM_BOT_TOKEN);

// bot.start(ctx => ctx.reply('Welcome'));
bot.start(({ reply }) => reply("Welcome"));

bot.startPolling();
bot.help(({ reply }) => reply("How can I help you ! Feel free to ask!"));

//client reply
// listen to incoming message
bot.on("message", ({ reply }) => reply("Hey!"));
bot.hears("hi", ({ reply }) => reply("Hi there"));
