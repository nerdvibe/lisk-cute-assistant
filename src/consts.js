exports.intents = [
  {
    ASK_PASSWORD_REBUILD_GREENDRAGON_MAIN:
      "ASK_PASSWORD_REBUILD_GREENDRAGON_MAIN"
  }
];

exports.snapshot_servers = [
  {
    GREENDRAGON_MAIN: "https://snapshot.lisknode.io/"
  }
];

exports.menu = {
  reply_markup: {
    keyboard: [
      ["🔎 Block Heights", "📦 Server Status"],
      ["🔑 Rebuild from snapshot Gr33ndragon"],
      ["📄 Get Logs"],
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
  SIGABERT: "SIGABERT"
};
