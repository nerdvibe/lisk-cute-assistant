import { sendSMSWelcome } from "./sms";
import settings from "../config";
import { respondServerStatus } from "./server";
import { bot } from "./telegram";

export const welcome = async () => {
  // Welcome sms message
  sendSMSWelcome(`Lisk Cute Assistant on ${settings.nodeName} rebooted`);
  // Welcome chat message
  if (settings.userId && settings.rebootWelcome) {
    await bot.reply(
      `🤖 Ahoy, I've just been rebooted. Here are some info regarding the server...`
    );
    await respondServerStatus();
  }
};
