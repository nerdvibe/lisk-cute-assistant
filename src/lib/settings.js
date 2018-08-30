import settings from "../config";
import {bot} from "./telegram";

export const returnSettingsMenu = () => {
  const checkForging = settings.executeIsForgingCron ? "❌ Stop is forging check" : "✅ Activate is forging check";
  const checkBlockHeights = settings.executeBlockHeightsCron ? "❌ Stop Block Height check" : "✅ Activate Block Height check";
  const checkServerStatus = settings.executeServerStatusCron ? "❌ Stop Server Status check" : "✅ Activate Server Status check";

  return bot.reply(`🤖⚙ BipBopBup Which settings you want to change?️
    <br><br>
    - Check if forging is enabled: ${settings.executeIsForgingCron}<br>
    - Check local and remote Block Heights: ${settings.executeBlockHeightsCron}<br>
    - Check server status: ${settings.executeServerStatusCron}<br>
    `, {
    reply_markup: {
      keyboard: [
        ["<< Back", checkForging],
        [checkBlockHeights],
        [checkServerStatus]
      ]
    },
    parse_mode: "HTML"
  });
};

export const toggleSetting = async(message) => {
  switch(message){
    case "❌ Stop is forging check":
      settings.executeIsForgingCron = false;
      break;
    case "✅ Activate is forging check":
      settings.executeIsForgingCron = true;
      break;

    case "❌ Stop Block Height check":
      settings.executeBlockHeightsCron= false;
      break;
    case "✅ Activate Block Height check":
      settings.executeBlockHeightsCron= true;
      break;

    case "❌ Stop Server Status check":
      settings.executeServerStatusCron= false;
      break;
    case "✅ Activate Server Status check":
      settings.executeBlockHeightsCron= true;
      break;
    default:
      return bot.reply(`Oh no, I didn't understand you...`);
  }

  await bot.reply(`👌 Done!`);
  return returnSettingsMenu();
};

export const toggleSettingsRegex = /(❌ Stop is forging check|✅ Activate is forging check|❌ Stop Block Height check|✅ Activate Block Height check|❌ Stop Server Status check|✅ Activate Server Status check)/i;
