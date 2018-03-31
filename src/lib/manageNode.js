const settings = require("../config");
const consts = require("../consts");
const { bot } = require("./telegram");
const exec = require("child_process").exec;
const axios = require("axios");

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

const setForgingOn = async () => {
  let nodeURL = settings.localNodeURL.substring(1,settings.localNodeURL.length-23);
  const replyForgeOn = await axios
  .post( nodeURL + "/api/delegates/forging/enable" , { secret: settings.nodeSecret } )
  .catch((error) => {
    bot.sendMessage(
      settings.chatId,
      `Omg! I didn't manage to switch on forging: \n` + error
    );
    awesome.errors.generalCatchCallback("", "set forging on");
  });

  if (!replyForgeOn || !replyForgeOn.data ){
    bot.sendMessage(
      settings.chatId,
      `Omg! I didn't manage to switch on forging: \n`
    );
    awesome.errors.generalCatchCallback("", "set forging on");
  } else if ( !replyForgeOn.data.success & replyForgeOn.data.error ){
    bot.sendMessage(
      settings.chatId,
      `Omg! I didn't manage to switch on forging: \n` + replyForgeOn.data.error
    );
    awesome.errors.generalCatchCallback("", "set forging on");
  } else if ( replyForgeOn.data.success == true )
    bot.sendMessage(settings.chatId, "Forging was successfully enabled");
}

const setForgingOff = async () => {
  let nodeURL = settings.localNodeURL.substring(1,settings.localNodeURL.length-23);
  const replyForgeOff = await axios
  .post( nodeURL + "/api/delegates/forging/enable" , { secret: settings.nodeSecret } )
  .catch((error) => {
    bot.sendMessage(
      settings.chatId,
      `Omg! I didn't manage to switch on forging: \n` + error
    );
    awesome.errors.generalCatchCallback("", "set forging on");
  });

  if (!replyForgeOff || !replyForgeOff.data ){
    bot.sendMessage(
      settings.chatId,
      `Omg! I didn't manage to switch on forging: \n`
    );
    awesome.errors.generalCatchCallback("", "set forging on");
  } else if ( !replyForgeOff.data.success & replyForgeOff.data.error ){
    bot.sendMessage(
      settings.chatId,
      `Omg! I didn't manage to switch on forging: \n` + replyForgeOn.data.error
    );
    awesome.errors.generalCatchCallback("", "set forging on");
  } else if ( replyForgeOff.data.success == true )
    bot.sendMessage(settings.chatId, "Forging was successfully enabled");
}

exports.startRebuild = startRebuild;
exports.setForgingOn = setForgingOn;
exports.setForgingOff = setForgingOff;
