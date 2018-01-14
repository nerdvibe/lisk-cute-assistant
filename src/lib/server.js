const settings = require("../config");
const { bot } = require("./telegram");
const exec = require("child_process").exec;

const respondServerStatus = async () => {
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

  exec(serverStatusExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to correctly check the server status: \n${stderr}`
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

const checkServerStatusCron = async () => {
  const cpuExec = `
    grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'
  `;
  const spaceUsageExec = `
    df / | awk '{ print $5 }' | tail -n 1
  `;
  const memoryExec = `
    free | grep Mem | awk '{print $3/$2 * 100.0}'
  `;

  exec(cpuExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to correctly check the cpu status: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    const stdoutValue = parseInt(stdout);
    if (stdoutValue > settings.cpuThreshold)
      bot.sendMessage(
        settings.chatId,
        `⚠️ CPU usage % over the threshold! ${stdout}`
      );
  });

  exec(spaceUsageExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to correctly check the space usage: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    const stdoutValue = parseInt(stdout);
    if (stdoutValue > settings.spaceUsageThreshold)
      bot.sendMessage(
        settings.chatId,
        `⚠️ RAM usage % over the threshold! ${stdout}`
      );
  });

  exec(memoryExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Omg! I didn't manage to correctly check the memory usage: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    const stdoutValue = parseInt(stdout);
    if (stdoutValue > settings.memoryThreshold)
      bot.sendMessage(
        settings.chatId,
        `⚠️ Space usage % over the threshold! ${stdout}`
      );
  });
};

exports.respondServerStatus = respondServerStatus;
exports.checkServerStatusCron = checkServerStatusCron;
