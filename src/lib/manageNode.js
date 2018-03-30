const settings = require("../config");
const consts = require("../consts");
const { bot } = require("./telegram");
const exec = require("child_process").exec;

// Todo: test in testnet before release!
const startRebuild = async (snapshotServerURL) => {
  const serverStatusExec = `
    cd ${settings.liskPWDFolder} && bash lisk.sh rebuild -u ${snapshotServerURL}`;

  bot.sendMessage(settings.chatId, "🕑 This will take a while...");

  exec(serverStatusExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to rebuild from gr33ndragon: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    bot.sendMessage(settings.chatId, stdout);
  });
};

const setForgingOn = async (nodeSecret) => {
  const serverStatusExec = `
    curl -k -H "Content-Type: application/json" -X POST -d '{"secret":"${nodeSecret}"}' http://localhost:7000/api/delegates/forging/enable`;

  exec(serverStatusExec, function(err, stdout, stderr) {
    var apiReply = JSON.parse(stdout);
    if ((err || stderr) && !apiReply.success) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to switch on forging: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    bot.sendMessage(settings.chatId, "Forging was successfully enabled for address: " + apiReply.address);
  });
};

const setForgingOff = async (nodeSecret) => {
  const serverStatusExec = `
    curl -k -H "Content-Type: application/json" -X POST -d '{"secret":"${nodeSecret}"}' http://localhost:7000/api/delegates/forging/disable`;

  exec(serverStatusExec, function(err, stdout, stderr) {
    var apiReply = JSON.parse(stdout);
    if ((err || stderr) && !apiReply.success) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to switch off forging: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    bot.sendMessage(settings.chatId, "Forging was successfully disabled for address: " + apiReply.address);
  });
};

exports.startRebuild = startRebuild;
exports.setForgingOn = setForgingOn;
exports.setForgingOff = setForgingOff;
