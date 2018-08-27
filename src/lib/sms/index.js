import settings from "../../config";
import { sendTextMagic } from "./textMagic";
import { sendTwilio } from "./twilio";
let lastSMS = new Date(0);

export const sendSMS = message => {
  const currentTime = new Date();

  const smsCompare = new Date(
    currentTime.getTime() + settings.minutesBetweenTexts * -60000
  );
  if (smsCompare > lastSMS) {
    if (settings.textMagicData.enabled) {
      sendTextMagic(message);
    }
    if (settings.twilioData.enabled) {
      sendTwilio(message);
    }
    lastSMS = currentTime;
  }
};

export const sendSMSWelcome = message => {
  if (settings.textMagicData.enabled && settings.textMagicData.rebootWelcome) {
    sendTextMagic(message);
  }
  if (settings.twilioData.enabled && settings.twilioData.rebootWelcome) {
    sendTwilio(message);
  }
};
