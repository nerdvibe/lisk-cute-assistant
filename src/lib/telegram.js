import settings from "../config";
import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(settings.telegramAPIToken, {
  polling: true,
  onlyFirstMatch: true
});

bot.reply = ((...args) => bot.sendMessage(
  settings.chatId, ...args
));

