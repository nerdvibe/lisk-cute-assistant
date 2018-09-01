import speedTest from 'speedtest-net';
import settings from "../config";
import { bot } from "./telegram";
import { exec } from "child_process";
import {sendToSlackWebhook, sendToWebhook} from "./webhooks";
import {webhookEvents} from "../consts";
import {sendSMS} from "./sms";

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
  if(!silentLoading) {
    await bot.reply('Now calculating server stats and network speed 🏎');
  }
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
    if (stdoutValue > settings.cpuThreshold) {
      bot.reply(`⚠️ CPU usage % over the threshold! ${stdout}`);
      sendToSlackWebhook(`Detected issue. CPU usage very high!`);
      sendToWebhook(webhookEvents.high_cpu_usage);
      sendSMS(
        `The CPU usage is over the threshold!`
      );
    }
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
    if (stdoutValue > settings.spaceUsageThreshold) {
      bot.reply(`⚠️ RAM usage % over the threshold! ${stdout}`);
      sendToSlackWebhook(`Detected issue. RAM usage very high!`);
      sendToWebhook(webhookEvents.high_ram_usage);
      sendSMS(
        `The RAM usage is over the threshold!`
      );
    }
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
    if (stdoutValue > settings.memoryThreshold) {
      bot.reply(`⚠️ Space usage % over the threshold! ${stdout}`);
      sendToSlackWebhook(`Detected issue. Disk usage very high!`);
      sendToWebhook(webhookEvents.high_disk_usage);
      sendSMS(
        `The Disk usage is over the threshold!`
      );
    }
  });


  // Speedtest
  const test = speedTest({maxTime: 5000});

  test.on('data', async(data) => {

    if(data.speeds.upload < settings.minUploadSpeed || data.speeds.download < settings.minDownloadSpeed || data.server.ping > settings.minNetworkPing) {
      await bot.reply(`⚠️ Something wrong with Network speed:
      
      <b>Upload</b>: ${data.speeds.upload} Mbps
      <b>Download</b>:  ${data.speeds.download} Mbps
      <b>Distance</b>:  ${data.server.distance} km
      <b>Ping</b>: ${data.server.ping} ms
      
      `, {
        parse_mode: "HTML"
      });
    }
    sendToSlackWebhook(`Detected issue. Disk usage very high!`);
    sendToWebhook(webhookEvents.low_speed_error);
    sendSMS(
      `The Disk usage is over the threshold!`
    );
  });

  test.on('error', err => {
    console.fail('Network speed check failed', err);
    bot.reply('Oh no! I didn\'t manage to calculate the network speed during the cronjob')
  });
};
