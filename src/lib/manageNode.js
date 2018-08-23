import settings from "../config";
import { bot } from "./telegram";
import { exec } from "child_process";

export const startRebuild = async snapshotServerURL => {
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
  });
};
