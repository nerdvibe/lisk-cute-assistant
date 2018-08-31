import settings from "../config";
import { bot } from "./telegram";
import { exec } from "child_process";

export const respondServerStatus = async () => {
  const serverStatusExec = `
    cd ${settings.liskPWDFolder}
    bash lisk.sh status
    echo
    echo CPU Usage:
    grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}'
    echo
    echo Disk Usage:
   
    df /home | awk '{ print $5 }' | tail -n 1
    echo
    echo RAM Usage:
    free | grep Mem | awk '{print $3/$2 * 100.0}'
  `;

  exec(serverStatusExec, (err, stdout, stderr) => {
    if (err || stderr) {
      bot.reply(
        `Omg! I didn't manage to correctly check the server status: \n${stderr}`
      );
      if (stdout) bot.reply(`This is what I got anyway (stdout): \n${stdout}`);
      return;
    }
    bot.reply(stdout);
  });
};

export const checkServerStatusCron = async () => {
  const cpuExec = `
    grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'
  `;
  const spaceUsageExec = `
    df / | awk '{ print $5 }' | tail -n 1
  `;
  const memoryExec = `
    free | grep Mem | awk '{print $3/$2 * 100.0}'
  `;

  exec(cpuExec, (err, stdout, stderr) => {
    if (err || stderr) {
      bot.reply(
        `Omg! I didn't manage to correctly check the cpu status: \n${stderr}`
      );
      if (stdout) bot.reply(`This is what I got anyway (stdout): \n${stdout}`);
      return;
    }
    const stdoutValue = parseInt(stdout);
    if (stdoutValue > settings.cpuThreshold)
      bot.reply(`⚠️ CPU usage % over the threshold! ${stdout}`);
  });

  exec(spaceUsageExec, (err, stdout, stderr) => {
    if (err || stderr) {
      bot.reply(
        `Omg! I didn't manage to correctly check the space usage: \n${stderr}`
      );
      if (stdout) bot.reply(`This is what I got anyway (stdout): \n${stdout}`);
      return;
    }
    const stdoutValue = parseInt(stdout);
    if (stdoutValue > settings.spaceUsageThreshold)
      bot.reply(`⚠️ RAM usage % over the threshold! ${stdout}`);
  });

  exec(memoryExec, (err, stdout, stderr) => {
    if (err || stderr) {
      bot.reply(
        `Omg! I didn't manage to correctly check the memory usage: \n${stderr}`
      );
      if (stdout) bot.reply(`This is what I got anyway (stdout): \n${stdout}`);
      return;
    }
    const stdoutValue = parseInt(stdout);
    if (stdoutValue > settings.memoryThreshold)
      bot.reply(`⚠️ Space usage % over the threshold! ${stdout}`);
  });
};
