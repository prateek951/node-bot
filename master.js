require("dotenv").config();
const TELEGRAF = require("telegraf");
const bot = new TELEGRAF(process.env.TELEGRAM_BOT_TOKEN);
const AXIOS_CLIENT = require("axios");
// bot.start(ctx => ctx.reply('Welcome'));
bot.start(({ reply }) => reply("Welcome"));

bot.startPolling();
bot.help(({ reply }) => reply("How can I help you ! Feel free to ask!"));

//client reply
// listen to incoming message
// bot.on("message", ({ reply }) => reply("Hey!"));
// bot.hears("hi", ({ reply }) => reply("Hi there"));

bot.on("message", async ({ message, reply }) => {
  const response = await AXIOS_CLIENT.get(
    "https://translate.yandex.net/api/v1.5/tr.json/translate",
    {
      params: {
        key: process.env.YANDEX_API_KEY,
        text: message.text,
        lang: "en"
      }
    }
  );
  reply(response.data.text[0]);
});
