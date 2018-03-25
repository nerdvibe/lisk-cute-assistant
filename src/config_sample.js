// Create a new file called "config.js" and replace all the fields with your configuration

exports.telegramAPIToken = ""; // Your telegram bot API key. Ask the @botfather for an api key
exports.chatId = ""; // your telegram id. This will make sure that the msgs are sent only to you
exports.OTPsecret = ""; // run "npm run generate-password" in order to get this setting
exports.localNodeURL = "http://127.0.0.1:8000/api/loader/status/sync"; // If you want to use for testing "https://node04.lisk.io/api/loader/status/sync" or use your node in testnet, don't forget the port 7000
exports.diffBlockHeight = 3; // The difference of block heights between your node and the others before triggering an alarm
exports.minBlockHeightNodeMatch = -3; // The difference of block heights between your node and the others before triggering an alarm
exports.rebootWelcome = true; // The reboot telegram message

exports.executeBlockHeightsCron = true;
exports.executeServerStatusCron = false;
exports.cpuThreshold = 90; // Sends a notification to the user when cpu usage is over this %
exports.spaceUsageThreshold = 10; // Sends a notification to the user when total free disk space in under this %
exports.memoryThreshold = 90; // Sends a notification to the user when memory usage is over this %

exports.liskPWDFolder = "/home/lisk/lisk-main"; // the path of your lisk node

exports.remoteNodes = [
  //nodes to check for the block heights
  {
    url: "https://liskwallet.punkrock.me/api/loader/status/sync",
    name: "punkrock"
  },
  {
    url: "https://node01.lisk.io/api/loader/status/sync",
    name: "lisk1"
  },
  {
    url: "https://node02.lisk.io/api/loader/status/sync",
    name: "lisk2"
  },
  {
    url: "https://node03.lisk.io/api/loader/status/sync",
    name: "lisk3"
  },
  {
    url: "https://node04.lisk.io/api/loader/status/sync",
    name: "lisk4"
  },
  {
    url: "https://node05.lisk.io/api/loader/status/sync",
    name: "lisk5"
  },
  {
    url: "https://node06.lisk.io/api/loader/status/sync",
    name: "lisk6"
  },
  {
    url: "https://node07.lisk.io/api/loader/status/sync",
    name: "lisk7"
  },
  {
    url: "https://node08.lisk.io/api/loader/status/sync",
    name: "lisk8"
  },
  {
    url: "https://login.lisk.asia/api/loader/status/sync",
    name: "liskAsia"
  },
  {
    url: "https://wallet.lisknode.io/api/loader/status/sync",
    name: "liskNode"
  }
];
