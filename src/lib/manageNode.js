import settings from "../config";
import { bot } from "./telegram";
import { exec } from "child_process";
import axios from "axios/index";

const FORGING_STATUS_ENDPOINT = `${settings.localNodeURL}/api/node/status/forging`;

export const isForging = async () => {
  const nodeStatus = await axios
    .get(FORGING_STATUS_ENDPOINT, { timeout: 5000 })
    .catch(() =>
      console.fail(`I can't access ${FORGING_STATUS_ENDPOINT}, is the API access open and localhost whitelisted?`)
    );

  return nodeStatus.data.data[0].forging;
};

export const startRebuild = async (snapshotServerURL, cb) => {
  const serverStatusExec = `
    cd ${settings.liskPWDFolder} && bash lisk.sh rebuild -u ${snapshotServerURL}`;

  bot.reply("🕑 This will take a while...");

  exec(serverStatusExec, (err, stdout, stderr) => {
    if (err || stderr) {
      bot.reply(
        `Omg! I didn't manage to rebuild from gr33ndragon: \n${stderr}`
      );
      if (stdout) bot.reply(`This is what I got anyway (stdout): \n${stdout}`);
      return;
    }
    bot.reply(stdout);
    cb();
  });
};

export const forgingStatus = async () => {
  const isCurrentlyForging = isForging();
  bot.reply(
    isCurrentlyForging
      ? "⛏ Yes! The node is set to forge"
      : "💤 No! The node is not set to forge"
  );
};

export const forgingStatusCron = async () => {

  const isCurrentlyForging = isForging();

  if(!isCurrentlyForging) {
    console.fail('Node is not forging, while it should be forging!');
    bot.reply(
      "⚠️💤 The forging on the node is switched off!"
    );
  }

};

export const returnForgingMenu = async () => {

  return bot.reply('⛏ Forging menu',
  {
    reply_markup: {
      keyboard: [
        ["<< Back"],
        ['⚡️ Is the node forging?']
      ]
    },
    parse_mode: "HTML"
  });

};
