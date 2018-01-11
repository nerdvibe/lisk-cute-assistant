require("awesome_starter");
require("./cron");
const settings = require("./config");
const consts = require("./consts");
const { respondBlockHeights } = require("./lib/blockheights");
const { respondServerStatus } = require("./lib/server");
const { testAuthenticationOTP } = require("./lib/auth");
const { startRebuild } = require("./lib/manageNode");
const {
  respondRecentLogs,
  respondGREPLogs,
  toggleTailing
} = require("./lib/logs");
const { cleanIntent, setIntent, sendChunkedMessage } = require("./lib/utils");
const { bot } = require("./lib/telegram");
let promptIntent = {
  //used for making the bot interactive when waiting for user input
  waitingPrompt: false,
  lastIntent: ""
};
let followLogs = false;

console.log(`

  _     _     _                            
 | |   (_)___| | __                        
 | |   | / __| |/ /                        
 | |___| \\__ \\   <                         
 |_____|_|___/_|\\_\\    
    ___      _           
  / ___|   _| |_ ___                       
 | |  | | | | __/ _ \\                      
 | |__| |_| | ||  __/                      
  \\____\\__,_|\\__\\___|   
                  _     _              _
    / \\   ___ ___(_)___| |_ __ _ _ __ | |_ 
   / _ \\ / __/ __| / __| __/ _\` | '_ \\| __|
  / ___ \\\\__ \\__ \\ \\__ \\ || (_| | | | | |_
 /_/   \\_\\___/___/_|___/\\__\\__,_|_| |_|\\__|




  Telegram Bot running only for ${settings.chatId}
  OTP secret is ${settings.OTPsecret}

 `);

if (settings.chatId && settings.rebootWelcome) {
  (async () => {
    await bot.sendMessage(
      settings.chatId,
      `🤖 Ahoy, I've just been rebooted. Here are some infos regarding the server...`
    );
    respondServerStatus();
  })();
}

//Menu
bot.onText(/(\/s|\/start|hey|hi|help|hello|yo|menu|menú|cancel|back)/i, msg => {
  promptIntent = cleanIntent();
  if(settings.chatId)
    bot.sendMessage(
      settings.chatId,
      `👋 Hey ${msg.from.first_name}! How can I help you with?`,
      consts.menu
    );
  else
    bot.sendMessage(
        msg.from.id,
        `👋 Hey ${msg.from.first_name}! Your id is: ${msg.from.id}`,
        consts.menu
    );
  console.log(
    "Client connected:",
    msg.from.id,
    msg.from.first_name,
    "@" + msg.from.username
  );
});

// blockHeight
bot.onText(/(\/b|block heights|block height)/i, async () => {
  promptIntent = cleanIntent();
  respondBlockHeights();
});

// server status
bot.onText(/(\/s|server status|server)/i, async () => {
  promptIntent = cleanIntent();
  respondServerStatus();
});

// test OTP
bot.onText(/\/test (.+)/, (msg, match) => {
  promptIntent = cleanIntent();
  testAuthenticationOTP(match[1].toString());
});

// return recent logs
bot.onText(/recent logs/i, () => {
  promptIntent = cleanIntent();
  respondRecentLogs();
});

// return tailing logs
bot.onText(/(follow logs|stop logs|Stop Following logs)/i, () => {
  promptIntent = cleanIntent();
  followLogs = toggleTailing();
  if (!followLogs)
    bot.sendMessage(
      settings.chatId,
      `👌 Okay stopping the logs tailing!`,
      consts.menu
    );
});

// return grep logs
bot.onText(/(cause|Logs) (.+)/i, (msg, match) => {
  promptIntent = cleanIntent();
  respondGREPLogs(match[2].toString());
});

// return logs menu
bot.onText(/get logs/i, () => {
  promptIntent = cleanIntent();
  const followLogsMsg = followLogs ? "❌ Follow logs" : "📄 Follow logs";
  return bot.sendMessage(settings.chatId, `Allrighty! Which logs you want?`, {
    reply_markup: {
      keyboard: [
        ["<< Back", "📄 Recent logs", followLogsMsg],
        ["⚠️ Forks cause 1", "⚠️ Forks cause 2", "⚠️ Forks cause 3"],
        ["⚠️ Forks cause 4", "⚠️ Forks cause 5", "Logs All Forks"],
        ["Logs SIGKILL", "Logs SIGABRT", "Logs Consensus"]
      ]
    }
  });
});

// Rebuild flow start
bot.onText(/🔑 Rebuild from snapshot Gr33ndragon/, async () => {
  promptIntent = setIntent(consts.intents.ASK_PASSWORD_REBUILD_GREENDRAGON_MAIN);
  return bot.sendMessage(
    settings.chatId,
    `🔐 Please provide the password to rebuild..`,
    {
      reply_markup: {
        keyboard: [["❌ Cancel"]]
      }
    }
  );
});

bot.on("message", async function(msg) {
  // inspects every message and looks if we are awaiting a reply from the user (prompting)

  if (!promptIntent.waitingPrompt) {
    // If we are not waiting for followup messages, return
    return;
  }
  prompting = true; //avoiding to go in default message

  if (msg.text === "❌ Cancel") {
    bot.sendMessage(settings.chatId, `👌 Okay mission aborted!`, consts.menu);
    setTimeout(cleanIntent, 200);
    return;
  }

  if (
    promptIntent.lastIntent ===
    consts.intents.ASK_PASSWORD_REBUILD_GREENDRAGON_MAIN
  ) {
    const otpToken = msg.text.toString();
    const validOTP = await testAuthenticationOTP(otpToken, true);

    if (validOTP) {
      bot.sendMessage(
        settings.chatId,
        `✅ You are authenticated! Now I'll start the rebuild, fasten your seat belts...`
      );
      startRebuild(consts.snapshot_servers.GREENDRAGON_MAIN);
    } else {
      bot.sendMessage(
        settings.chatId,
        `I'm sorry, but that's not a valid password... Try again...`,
        {
          reply_markup: {
            keyboard: [["❌ Cancel"]]
          }
        }
      );
    }
  }
});

bot.onText(/.+/, function(msg) {
  // Default message in case we didn't get the request
  if (!promptIntent.waitingPrompt)
    bot.sendMessage(
      msg.chat.id,
      "🤔I've not been coded to to understand that info, yet..."
    );
});
