const settings = require("../config");
const consts = require("../consts");
const { bot } = require("./telegram");
const { sendChunkedMessage } = require("./utils");
const exec = require("child_process").exec;
let followLogs = false;
const Tail = require("tail").Tail;
let tail, batchSender;
let logsBatch = []; //used to batching logs when tailing

// Initializing the tailing
try {
  tail = new Tail(settings.liskPWDFolder + "/logs/lisk.log"); // logs/lisk.log
  tail.on("line", function(data) {
    if (followLogs) {
      logsBatch.push(data);
    }
  });

  tail.on("error", function(error) {
    bot.sendMessage(
      settings.chatId,
      `DAMN! Error in reading the logs... ${error}`
    );
    tail.unwatch();
    logsBatch = [];
  });
} catch (error) {
  bot.sendMessage(
    settings.chatId,
    `DAMN! Error in reading the logs... ${error}`
  );
}

// Toggler for tailing logs
const toggleTailing = () => {
  if (!followLogs) {
    try {
      tail.watch();
      followLogs = !followLogs;
      batchSender = setInterval(() => {
        sendChunkedMessage(logsBatch.join("\n"));
        logsBatch = [];
      }, 1000);
    } catch (e) {
      bot.sendMessage(
        settings.chatId,
        "tailing not enabled. Probably logs file not found"
      );
    }
  } else {
    try {
      tail.unwatch();
      followLogs = !followLogs;
      clearInterval(batchSender);
    } catch (e) {
      bot.sendMessage(
        settings.chatId,
        "tailing not enabled. Probably logs file not found"
      );
    }
  }
  if (followLogs)
    return bot.sendMessage(settings.chatId, `Ok I'll tail the logs file...`, {
      reply_markup: {
        keyboard: [["❌ Stop Following logs"], ["🏠 Menu"]]
      }
    });
  return followLogs;
};

// Todo: test in testnet before release!
const respondRecentLogs = async () => {
  const recentLogsExec = `
    cd ${settings.liskPWDFolder}/logs/ && tail lisk.log -n 2000
  `;

  exec(recentLogsExec, function(err, stdout, stderr) {
    console.log(err);
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to get the logs: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    bot.sendMessage(settings.chatId, "📄 Here are the logs:");
    sendChunkedMessage(stdout);
  });
};

// Todo: test in testnet before release!
const respondGREPLogs = async type => {
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

// Todo: test in testnet before release!
const execGREPLogs = async type => {
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

  exec(forkLogsExec, async function(err, stdout, stderr) {
    if ((err || stderr) && (err.killed)) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to get the logs: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    else if(err && !err.killed)
      return bot.sendMessage(
        settings.chatId,
        `No logs found with that query in the last lines of logs...`
      );
    await bot.sendMessage(settings.chatId, "📄 Here are the fork logs:");
    sendChunkedMessage(stdout);
  });
};

exports.respondRecentLogs = respondRecentLogs;
exports.toggleTailing = toggleTailing;
exports.respondGREPLogs = respondGREPLogs;
