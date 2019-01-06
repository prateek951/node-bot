require("dotenv").config();
const AXIOS_CLIENT = require("axios");
const TELEGRAF = require("telegraf");
const LocalSession = require("telegraf-session-local");
const bot = new TELEGRAF(process.env.TELEGRAM_BOT_TOKEN);

bot.use(new LocalSession({ database: ".data/session.json" }).middleware());
// bot.start(ctx => ctx.reply('Welcome'));
bot.start(({ reply }) => reply("Welcome"));

// bot.help(({ reply }) => reply("How can I help you ! Feel free to ask!"));

//client reply
// listen to incoming message
// bot.on("message", ({ reply }) => reply("Hey!"));
// bot.hears("hi", ({ reply }) => reply("Hi there"));
bot.command("from", ({ message, reply, session }) => {
  const lang = message.text.substring(6);
  const { length: LNG_CODE_LENGTH } = lang;
  if (LNG_CODE_LENGTH > 2 || LNG_CODE_LENGTH === 1) {
    reply("🤔 Language code must be 2 characters, e.g. 'en' or 'fr'");
    return;
  }
  reply(
    lang
      ? `✅ "from" language set to ${lang} `
      : `✅ autodetect "from" language`
  );
  //Set the session from property
  session.from = lang;
});

bot.command("to", ({ message, reply, session }) => {
  const lang = message.text.substring(4);
  const { length: LNG_CODE_LENGTH } = lang;
  if (LNG_CODE_LENGTH === 0) {
    reply(
      '🤔 Please specify a language code! It must be 2 chars, e.g. "en" or "fr"'
    );
    return;
  }
  if (LNG_CODE_LENGTH > 2 || LNG_CODE_LENGTH === 1) {
    reply('🤔 Language code must be 2 chars, e.g. "en" or "fr"');
    return;
  }
  //Set the session to property
  session.to = lang;
  reply(`✅ "to" language set to ${lang} `);
});

bot.on("message", async ({ message, reply, session }) => {
  const lang = (session.from ? `${session.from}-` : ``) + (session.to || "en");
  console.log(lang);
  const response = await AXIOS_CLIENT.get(
    "https://translate.yandex.net/api/v1.5/tr.json/translate",
    {
      params: {
        key: process.env.YANDEX_API_KEY,
        text: message.text,
        lang: lang
      }
    }
  );
  const translation = response.data.text[0];
  reply(translation);

  let messages = JSON.parse(session.messages) || [];
  messages.push({ text: message.text, translation: translation });
  session.messages = JSON.stringify(messages);
});

bot.command("history", ({ reply }) => {
  try {
    reply(
      JSON.parse(session.messages)
        .map(message => `${message.text} : ${message.translation}`)
        .join("\n")
    );
  } catch (ex) {
    const error = new Error(ex);
    error.statusCode = 500;
    throw error;
  }
});

bot.startPolling();
