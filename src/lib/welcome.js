import { sendSMSWelcome } from "./sms";
import settings from "../config";
import { respondServerStatus } from "./server";
import { bot } from "./telegram";
import {sendToSlackWebhook, sendToWebhook} from "./webhooks";
import {webhookEvents} from "../consts";

export const welcome = async () => {
  // Welcome sms message
  sendSMSWelcome(`Lisk Cute Assistant rebooted`);
  sendToSlackWebhook(`Lisk Cute Assistant on rebooted`);
  sendToWebhook(webhookEvents.forging_switched_off);
  // Welcome chat message
  if (settings.userId && settings.rebootWelcome) {
    await bot.reply(
      `🤖 Ahoy, I've just been rebooted. Here are some info regarding the server...`
    );
    await respondServerStatus(true);
  }
};
