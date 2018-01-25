const settings = require("../config");
const { bot } = require("./telegram");
const exec = require("child_process").exec;

const respondServerStatus = async () => {
  const serverStatusExec = `
    cd ${settings.liskPWDFolder}
    echo Lisk status:
    bash lisk.sh status
    echo
    echo Total CPU usage:
    grep 'cpu ' /proc/stat | awk '{cpu_usage=($2+$4)*100/($2+$4+$5)} END {print cpu_usage " %"}'
    echo
    echo Total RAM usage:
    free -h | grep Mem | awk '{print $3/$2 * 100 " %"}'
 	  echo
    echo Total of free space on all disks:
	  df | awk 'BEGIN {} {sum1+=$2;sum2+=$4} END {print (sum2/sum1)*100 " %"}'
    echo
    echo Total of free space on /home:
	  df -h /home | awk 'BEGIN {} {sum1+=$2;sum2+=$4} END {print (sum2/sum1)*100 " %"}'
   `;
  
  exec(serverStatusExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Oops! I didn't manage to correctly check the server status: \n${stderr}`
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
    grep 'cpu ' /proc/stat | awk '{cpu_usage=($2+$4)*100/($2+$4+$5)} END {print cpu_usage}'
  `;
  const spaceUsageExec = `
    df | awk 'BEGIN {} {sum1+=$2;sum2+=$4} END {print (sum2/sum1)*100}'
  `;
  const memoryExec = `
    free -h | grep Mem | awk '{print $3/$2 * 100}'
  `;

  exec(cpuExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Oops! I didn't manage to correctly check the cpu status: \n${stderr}`
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
        `⚠️ CPU usage in % is over the threshold! ${stdout}`
      );
  });

  exec(spaceUsageExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Oops! I didn't manage to correctly check the space usage: \n${stderr}`
      );
      if (stdout)
        bot.sendMessage(
          settings.chatId,
          `This is what I got anyway (stdout): \n${stdout}`
        );
      return;
    }
    const stdoutValue = parseInt(stdout);
    if (stdoutValue < settings.spaceUsageThreshold)
      bot.sendMessage(
        settings.chatId,
        `⚠️ Total disk space usage in % is under the threshold! ${stdout}`
      );
  });

  exec(memoryExec, function(err, stdout, stderr) {
    if (err || stderr) {
      bot.sendMessage(
        settings.chatId,
        `Oops! I didn't manage to correctly check the memory usage: \n${stderr}`
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
        `⚠️ Ram usage in % is over the threshold! ${stdout}`
      );
  });
};

exports.respondServerStatus = respondServerStatus;
exports.checkServerStatusCron = checkServerStatusCron;
