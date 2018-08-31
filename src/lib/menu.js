import settings from "../config";
import consts from "../consts";
import { bot } from "./telegram";
import { cleanIntent, setIntent } from "./utils";
import { startRebuild, returnForgingMenu, forgingStatus } from "./manageNode";
import { respondServerStatus } from "./server";
import { respondBlockHeights } from "./blockheights";
import { testAuthenticationOTP } from "./auth";
import { respondRecentLogs, respondGREPLogs, toggleTailing } from "./logs";
import { returnSettingsMenu, toggleSettingsRegex, toggleSetting } from "./settings";
import { nodeHealthCron } from "./cron";

let promptIntent = {
  //used for making the bot interactive when waiting for user input
  waitingPrompt: false,
  lastIntent: ""
};
let followLogs = false;

export const initializeMenu = () => {
  //Menu
  bot.onText(
    /(\/s|\/start|hey|hi|help|hello|yo|menu|menú|cancel|back)/i,
    msg => {
      promptIntent = cleanIntent();
      if (settings.userId)
        bot.reply(
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
        `Client connected: ${msg.from.id} ${msg.from.first_name} @${msg.from.username}`
      );
    }
  );

  // blockHeight
  bot.onText(/(\/b|🔎 Block Heights)/i, async () => {
    promptIntent = cleanIntent();
    await respondBlockHeights();
  });

  // server status
  bot.onText(/(\/s|📦 Server Status)/i, async () => {
    promptIntent = cleanIntent();
    respondServerStatus();
  });

  // test OTP
  bot.onText(/\/test (.+)/, async (msg, match) => {
    promptIntent = cleanIntent();
    await testAuthenticationOTP(match[1].toString());
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
      bot.reply(`👌 Okay stopping the logs tailing!`, consts.menu);
  });

  // return grep logs
  bot.onText(/(cause|Logs) (.+)/i, async (msg, match) => {
    promptIntent = cleanIntent();
    await respondGREPLogs(match[2].toString());
  });

  // return logs menu
  bot.onText(/get logs/i, () => {
    promptIntent = cleanIntent();
    const followLogsMsg = followLogs ? "❌ Follow logs" : "📄 Follow logs";
    return bot.reply(`Allrighty! Which logs you want?`, {
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

  bot.onText(/⚙ Settings/i, async() => {
    promptIntent = cleanIntent();
    await returnSettingsMenu()
  });


  bot.onText(toggleSettingsRegex, async(msg) => {
    promptIntent = cleanIntent();
    await toggleSetting(msg.text);
  });

  bot.onText(/⛏ Forging/i, async() => {
    promptIntent = cleanIntent();
    await returnForgingMenu()
  });

  bot.onText(/⚡️ Is the node forging?/i, async() => {
    console.log('hit');
    promptIntent = cleanIntent();
    await forgingStatus();
  });

  // Rebuild flow start
  bot.onText(/🔑 Rebuild from snapshot Gr33ndragon/, async () => {
    promptIntent = setIntent(
      consts.intents.ASK_PASSWORD_REBUILD_GREENDRAGON_MAIN
    );
    return bot.reply(`🔐 Please provide the password to rebuild..`, {
      reply_markup: {
        keyboard: [["❌ Cancel"]]
      }
    });
  });

  bot.on("message", async msg => {
    // inspects every message and looks if we are awaiting a reply from the user (prompting)

    if (!promptIntent.waitingPrompt) {
      // If we are not waiting for followup messages, return
      return;
    }

    if (msg.text === "❌ Cancel") {
      bot.reply(`👌 Okay mission aborted!`, consts.menu);
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
        bot.reply(
          `✅ You are authenticated! Now I'll start the rebuild, fasten your seat belts...`
        );
        nodeHealthCron.stop();
        startRebuild(
          consts.snapshot_servers.GREENDRAGON_MAIN,
          nodeHealthCron.start
        );
      } else {
        bot.reply(
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

  bot.onText(/.+/, async msg => {
    // Default message in case we didn't get the request
    console.log('Missed msg: ', msg);
    if (!promptIntent.waitingPrompt)
      await bot.sendMessage(
        msg.chat.id,
        "🤔I've not been coded to to understand that info, yet..."
      );
  });
};
