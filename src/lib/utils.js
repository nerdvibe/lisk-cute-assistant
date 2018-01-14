const { bot } = require("./telegram");
const settings = require("../config");

const cleanIntent = () => {
  return {
    //used for making the bot interactive when waiting for user input
    waitingPrompt: false,
    lastIntent: ""
  };
};

const setIntent = intent => {
  return {
    //used for making the bot interactive when waiting for user input
    waitingPrompt: true,
    lastIntent: intent
  };
};

const sendChunkedMessage = async message => {
  const throttler = chunk => {
    return new Promise(resolve => {
      if(chunk.length < 1)
        return resolve();
      setTimeout(() => resolve(bot.sendMessage(settings.chatId, chunk)), 1500);
    });
  };

  if (message.length > 3000) {
    const chunkedMessages = message.match(/[\s\S]{1,3000}/g);
    for (let chunk of chunkedMessages) {
      await throttler(chunk);
    }
  } else if (!message || !message.length) {
    return;
  } else {
    return await bot.sendMessage(settings.chatId, message);
  }
};

exports.cleanIntent = cleanIntent;
exports.setIntent = setIntent;
exports.sendChunkedMessage = sendChunkedMessage;
