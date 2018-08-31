import settings from "../config";
import consts from "../consts";
import { bot } from "./telegram";
import { sendChunkedMessage } from "./utils";
import { exec } from "child_process";
import { Tail } from "tail";

let followLogs = false;
let tail, batchSender;
let logsBatch = []; //used to batching logs when tailing

// Initializing the tailing
try {
  tail = new Tail(`${settings.liskPWDFolder}/logs/lisk.log`);
  tail.on("line", data => {
    if (followLogs) {
      logsBatch.push(data);
    }
  });

  tail.on("error", error => {
    bot.reply(`DAMN! Error in reading the logs... ${error}`);
    tail.unwatch();
    logsBatch = [];
  });
} catch (error) {
  bot.reply(`DAMN! Error in reading the logs... ${error}`);
}

// Toggler for tailing logs
export const toggleTailing = () => {
  if (!followLogs) {
    try {
      tail.watch();
      followLogs = !followLogs;
      batchSender = setInterval(() => {
        sendChunkedMessage(logsBatch.join("\n"));
        logsBatch = [];
      }, 1000);
    } catch (e) {
      bot.reply("tailing not enabled. Probably logs file not found");
    }
  } else {
    try {
      tail.unwatch();
      followLogs = !followLogs;
      clearInterval(batchSender);
    } catch (e) {
      bot.reply("tailing not enabled. Probably logs file not found");
    }
  }
  if (followLogs)
    return bot.reply(`Ok I'll tail the logs file...`, {
      reply_markup: {
        keyboard: [["❌ Stop Following logs"], ["🏠 Menu"]]
      }
    });
  return followLogs;
};

export const respondRecentLogs = async () => {
  const recentLogsExec = `
    cd ${settings.liskPWDFolder}/logs/ && tail lisk.log -n 2000
  `;

  exec(recentLogsExec, (err, stdout, stderr) => {
    console.log(err);
    if (err || stderr) {
      bot.reply(`Omg! I didn't manage to get the logs: \n${stderr}`);
      if (stdout) bot.reply(`This is what I got anyway (stdout): \n${stdout}`);
      return;
    }
    bot.reply("📄 Here are the logs:");
    sendChunkedMessage(stdout);
  });
};

export const respondGREPLogs = async type => {
  switch (type) {
    case "All Forks":
      execGREPLogs(consts.logsGREP.ALL);
      break;
    case "1":
      execGREPLogs(consts.logsGREP[1]);
      break;
    case "2":
      execGREPLogs(consts.logsGREP[2]);
      break;
    case "3":
      execGREPLogs(consts.logsGREP[3]);
      break;
    case "4":
      execGREPLogs(consts.logsGREP[4]);
      break;
    case "5":
      execGREPLogs(consts.logsGREP[5]);
      break;
    case "Consensus":
      execGREPLogs(consts.logsGREP.CONSENSUS);
      break;
    case "SIGKILL":
      execGREPLogs(consts.logsGREP.SIGKILL);
      break;
    case "SIGABRT":
      execGREPLogs(consts.logsGREP.SIGABRT);
      break;
    default:
      break;
  }
};

export const execGREPLogs = async type => {
  let forkLogsExec;

  if (type === consts.logsGREP.ALL)
    forkLogsExec = `cd ${settings.liskPWDFolder}/logs/ && tail lisk.log -n 100000 | grep '"cause"'`;

  if (
    type === consts.logsGREP["1"] ||
    type === consts.logsGREP["2"] ||
    type === consts.logsGREP["3"] ||
    type === consts.logsGREP["4"] ||
    type === consts.logsGREP["5"]
  )
    forkLogsExec = `cd ${settings.liskPWDFolder}/logs/ && tail lisk.log -n 100000 | grep '"cause":${parseInt(
      type
    )}'`;

  if (type === consts.logsGREP.CONSENSUS)
    forkLogsExec = `cd ${settings.liskPWDFolder}/logs/ && tail lisk.log -n 1000 | grep "consensus"`;

  if (type === consts.logsGREP.SIGKILL)
    forkLogsExec = `cd ${settings.liskPWDFolder}/logs/ && tail lisk.log -n 100000 | grep "SIGKILL"`;

  if (type === consts.logsGREP.SIGABRT)
    forkLogsExec = `cd ${settings.liskPWDFolder}/logs/ && tail lisk.log -n 100000 | grep "SIGABRT"`;

  exec(forkLogsExec, async (err, stdout, stderr) => {
    if ((err || stderr) && err.killed) {
      bot.reply(`Omg! I didn't manage to get the logs: \n${stderr}`);
      if (stdout) bot.reply(`This is what I got anyway (stdout): \n${stdout}`);
      return;
    } else if (err && !err.killed)
      return bot.reply(
        `No logs found with that query in the last lines of logs...`
      );
    await bot.reply("📄 Here are the fork logs:");
    sendChunkedMessage(stdout);
  });
};
