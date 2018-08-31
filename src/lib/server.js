import speedTest from 'speedtest-net';
import settings from "../config";
import { bot } from "./telegram";
import { exec } from "child_process";

const runSpeedTest = () => {
  const test = speedTest({maxTime: 5000});

  test.on('data', async(data) => {
    await bot.reply(`Network speed:
    
    <b>Upload</b>: ${data.speeds.upload} Mbps
    <b>Download</b>:  ${data.speeds.download} Mbps
    <b>Distance</b>:  ${data.server.distance} km
    <b>Ping</b>: ${data.server.ping} ms
    
    `, {
      parse_mode: "HTML"
    });
  });

  test.on('error', err => {
    bot.reply('Oh no! I didn\'t manage to calculate the network speed')
  });
};



export const respondServerStatus = async (silentLoading = false) => {
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

  if(!silentLoading) {
    await bot.reply('Now calculating the network speed 🏎');
  }

  runSpeedTest();
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


  // Speedtest
  const test = speedTest({maxTime: 5000});

  test.on('data', async(data) => {

    if(data.speeds.upload < settings.minNetworkSpeed || data.speeds.upload < settings.minNetworkSpeed || data.speeds.upload > settings.minNetworkPing) {
      await bot.reply(`⚠️ Something wrong with Network speed:
      
      <b>Upload</b>: ${data.speeds.upload} Mbps
      <b>Download</b>:  ${data.speeds.download} Mbps
      <b>Distance</b>:  ${data.server.distance} km
      <b>Ping</b>: ${data.server.ping} ms
      
      `, {
        parse_mode: "HTML"
      });
    }
  });

  test.on('error', err => {
    console.fail('Network speed check failed', err);
    bot.reply('Oh no! I didn\'t manage to calculate the network speed during the cronjob')
  });
};
