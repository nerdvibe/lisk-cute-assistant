import settings from "../config";
import { bot } from "./telegram";
import { exec } from "child_process";
import awesome from "awesome_starter";
import axios from "axios/index";

const FORGING_STATUS_ENDPOINT = `${settings.localNodeURL}/api/forging/status`;

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
  const isForging = isForging();
  bot.reply(
    isForging
      ? "⛏ The server is set to forge"
      : "💤 The node is not set to forge"
  );
};

export const forgingStatusCron = async () => {

  const isForging = isForging();

  if(!isForging) {
    console.fail('Node is not forging, while it should be forging!');
    bot.reply(
      "⚠️💤 The forging on the node is switched off!"
    );
  }

};

export const isForging = async () => {
  const nodeStatus = await axios
    .get(url ? url : FORGING_STATUS_ENDPOINT, { timeout: 5000 })
    .catch(() =>
      awesome.errors.generalCatchCallback("", "get local block height")
    );

  //TODO DOUBLE CHECK
  return nodeStatus.data.data.forging;
};

export const returnForgingMenu = async () => {

  return bot.reply('⛏ Forging menu',
  {
    reply_markup: {
      keyboard: [
        ["<< Back"],
        ['Check if node is set to forge']
      ]
    },
    parse_mode: "HTML"
  });

};
