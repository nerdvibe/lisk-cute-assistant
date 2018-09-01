exports.intents = {
  ASK_PASSWORD_REBUILD_GREENDRAGON_MAIN: "ASK_PASSWORD_REBUILD_GREENDRAGON_MAIN"
};

exports.snapshot_servers = {
  GREENDRAGON_MAIN: "https://snapshot.lisknode.io"
};

exports.menu = {
  reply_markup: {
    keyboard: [
      ["🔎 Block Heights", "📦 Server Status"],
      ["🔑 Rebuild from snapshot Gr33ndragon"],
      ["📄 Get Logs", '⛏ Forging' ,"⚙ Settings" ],
      ["🏠 Menu"]
    ]
  }
};

exports.logsGREP = {
  ALL: "ALL",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  CONSENSUS: "CONSENSUS",
  SIGKILL: "SIGKILL",
  SIGABRT: "SIGABRT",
  FORGED: "FORGED"
};

exports.webhookEvents = {
  forging_switched_off: 'forging_switched_off',
  blockheights_missmatch: 'blockheights_missmatch',
  high_cpu_usage: 'high_cpu_usage',
  high_ram_usage: 'high_ram_usage',
  high_disk_usage: 'high_disk_usage',
  low_speed_error: 'low_speed_error',
  no_local_blockheight: 'no_local_blockheight'
};
