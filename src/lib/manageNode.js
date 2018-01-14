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

exports.startRebuild = startRebuild;
