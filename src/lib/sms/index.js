const settings = require("../../config");
const { sendTextMagic } = require("./textMagic");
const { sendTwilio } = require("./twilio");
let lastSMS = new Date(0);

const sendSMS = message => {
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

const sendSMSWelcome = message => {
  if (settings.textMagicData.enabled && settings.textMagicData.rebootWelcome) {
    sendTextMagic(message);
  }
  if (settings.twilioData.enabled && settings.twilioData.rebootWelcome) {
    sendTwilio(message);
  }
};

exports.sendSMS = sendSMS;
exports.sendSMSWelcome = sendSMSWelcome;
