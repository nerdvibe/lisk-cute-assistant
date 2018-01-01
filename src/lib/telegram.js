process.env["NTBA_FIX_319"] = 1;

const settings = require("../config");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(settings.telegramAPIToken, {
  polling: true,
  onlyFirstMatch: true
});

exports.bot = bot;
