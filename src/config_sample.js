// Create a new file called "config.js" and replace all the fields with your configuration

exports.telegramAPIToken = ""; // Your telegram bot API key. Ask the @botfather for an api key
exports.userId = ""; // your telegram id. This will make sure that the msgs are sent only to you
exports.OTPsecret = ""; // run "npm run generate-password" in order to get this setting
exports.localNodeURL = "http://127.0.0.1:8000"; // If you want to use for testing "https://node04.lisk.io" or use your node in testnet, don't forget the port 7000
exports.diffBlockHeight = 3; // The difference of block heights between your node and the others before triggering an alarm
exports.minBlockHeightNodeMatch = -3; // The difference of block heights between your node and the others before triggering an alarm
exports.rebootWelcome = true; // The reboot telegram message
exports.nodeName = "My node"; // Used to identify which node is being referred to with SMS
exports.minutesBetweenTexts = 15; // How many mins. before sending another SMS

exports.textMagicData = {
  enabled: false, // switch to true only if you have the following credentials for textMagic.
  username: "",
  APIkey: "",
  phoneNumber: "",
  rebootWelcome: true // It sends an sms at the startup of the bot
};

exports.twilioData = {
  enabled: false, // switch to true only if you have the following credentials for Twilio.
  username: "",
  password: "",
  fromPhoneNumber: "",
  toPhoneNumber: "",
  rebootWelcome: true // It sends an sms at the startup of the bot
};

exports.slackWebhook = { // If you want to receive critical messages to slack
  url: '', // get the url from slack incoming webhooks. It should look like e.g. https://hooks.slack.com/services/keeeeey/keeeeyzzz2/keeeeyzzz3
  channel: '', // the channel name, including #. e.g. #general
  icon_emoji: '' // an emoji to replace the boring webhooks logo in the slack messages
};

exports.webhook = { // If you want to use IFTTT
  url: '', // get the url from IFTTT incoming webhooks channel -> settings. It must include the {event} tag as it is. e.g. https://maker.ifttt.com/trigger/{event}/with/key/your-crazy-key
};

// Cronjobs
exports.executeBlockHeightsCron = true; // Compare the local block height with the nodes of the network every minute
exports.executeIsForgingCron = true; // Check every minute if the node is forging or not
exports.executeServerStatusCron = false; // Check the server stats

exports.cpuThreshold = 90; // Sends a notification to the user when cpu usage is over this %
exports.spaceUsageThreshold = 10; // Sends a notification to the user when total free disk space in under this %
exports.memoryThreshold = 90; // Sends a notification to the user when memory usage is over this %
exports.minUploadSpeed = 100; // expressed in Mbps
exports.minDownloadSpeed = 100; // expressed in Mbps
exports.minNetworkPing = 100; // expressed in ms

exports.liskPWDFolder = "/home/lisk/lisk-main"; // the path of your lisk node

exports.remoteNodes = [
  //nodes to check for the block heights
  {
    url: "https://liskwallet.punkrock.me/api/node/status",
    name: "punkrock"
  },
  {
    url: "https://node01.lisk.io/api/node/status",
    name: "lisk1"
  },
  {
    url: "https://node02.lisk.io/api/node/status",
    name: "lisk2"
  },
  {
    url: "https://node03.lisk.io/api/node/status",
    name: "lisk3"
  },
  {
    url: "https://node04.lisk.io/api/node/status",
    name: "lisk4"
  },
  {
    url: "https://node05.lisk.io/api/node/status",
    name: "lisk5"
  },
  {
    url: "https://node06.lisk.io/api/node/status",
    name: "lisk6"
  },
  {
    url: "https://node07.lisk.io/api/node/status",
    name: "lisk7"
  },
  {
    url: "https://node08.lisk.io/api/node/status",
    name: "lisk8"
  },
  {
    url: "https://login.lisk.asia/api/node/status",
    name: "liskAsia"
  },
  {
    url: "https://wallet.lisknode.io/api/node/status",
    name: "liskNode"
  }
];
