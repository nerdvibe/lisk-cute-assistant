import awesome from "awesome_starter";
import axios from "axios";
import settings from "../config";
import { bot } from "./telegram";
import { sendSMS } from "./sms/index";
const BLOCKHEIGHT_ENDPOINT = `${settings.localNodeURL}/api/node/status`;


//used for the cronjob
//TODO: Improve potential duplicated code with respondBlockHeights()
export const compareBlockHeightsCron = async () => {
  const localBlockheight = await getBlockHeight().catch(() =>
    awesome.errors.generalCatchCallback("", "get local block height")
  );
  let isSameBlockHeights;

  if (localBlockheight === "0") {
    sendSMS(
      `Did not manage to get local block height during routine check for ${settings.nodeName}`
    );

    return bot.reply(
      "I didn't manage to get the local block height during the routine check!"
    );
  }

  const remotesNodes = await parseRemoteBH();

  // checking if the local block height is matching with the majority of the others
  const zero = remotesNodes.matchingBlockHeights - settings.remoteNodes.length;
  isSameBlockHeights = zero >= settings.minBlockHeightNodeMatch;

  if (!isSameBlockHeights) {
    console.fail(
      "Detected issue: The block heights are not matching with the rest of the network"
    );
    await bot.reply(`⚠️ Detected issue while executing the routine check`, {
      parse_mode: "HTML"
    });
    await bot.reply(`<b>Local block height</b> is: ${localBlockheight}`, {
      parse_mode: "HTML"
    });
    await bot.reply(remotesNodes.otherBlockMessage, { parse_mode: "HTML" });
    await bot.reply(
      "⚠️ Detected issue: The block heights are not matching with the rest of the network"
    );

    sendSMS(
      `Detected issue with ${settings.nodeName}. local block height is ${localBlockheight}`
    );
  }
};

// Used for replying to user message
export const respondBlockHeights = async () => {
  const initialLocalBlockHeight = await getBlockHeight().catch(() =>
    awesome.errors.generalCatchCallback("", "get local block height")
  );
  let isSameBlockHeights;

  if (initialLocalBlockHeight === "0")
    return bot.reply("Error getting the local block height");

  console.log(`Local block height is: ${initialLocalBlockHeight}`);
  bot.reply(`<b>Local block height</b> is: ${initialLocalBlockHeight}`, {
    parse_mode: "HTML"
  });

  await bot.reply(`Parsing remote nodes ✨🔎`);

  const remotesNodes = await parseRemoteBH();

  //publishing summary other block heights
  await bot.reply(
    remotesNodes.remoteBHMessage,
    {
      parse_mode: "HTML"
    }
  );

  // checking if the local block height is matching with the majority of the others
  let zero = remotesNodes.matchingBlockHeights - settings.remoteNodes.length;
  isSameBlockHeights = zero >= settings.minBlockHeightNodeMatch;

  if (isSameBlockHeights) {
    console.success("Your node seems to have the correct height");
    bot.reply("👌 Your node seems to have the correct height");
  } else {
    console.fail(
      "The block heights are not matching with the rest of the network"
    );
    bot.reply(
      "😡 The block heights are not matching with the rest of the network"
    );
  }
};

// Returns a message for TG and how many matching blockheights are matching
export const parseRemoteBH = async() => {
  let remoteBHMessage = "";
  let matchingBlockHeights = 0;

  for (let node of settings.remoteNodes) {
    let remoteNode = Object.assign({}, node);
    remoteNode.blockHeight = await getBlockHeight(node.url).catch(() =>
      awesome.errors.generalCatchCallback("", `get remote height ${node.name}`)
    );

    const localBlockHeightCheck = await getBlockHeight().catch(() =>
      awesome.errors.generalCatchCallback("", "localBlockHeightCheck")
    );

    //compiling message
    remoteBHMessage += `\n\n<b>${remoteNode.name}</b> : ${remoteNode.blockHeight} (L: ${localBlockHeightCheck})`;

    //checking if my block height is in sync with this node
    let zero = localBlockHeightCheck - remoteNode.blockHeight;
    if (zero >= -settings.diffBlockHeight && zero <= settings.diffBlockHeight) {
      matchingBlockHeights++;
    }
  }

  return {
    remoteBHMessage,
    matchingBlockHeights
  }
};

export const getBlockHeight = async (url) => {
  const blockHeightData = await axios
    .get(url ? url : BLOCKHEIGHT_ENDPOINT, {timeout: 5000})
    .catch((e) =>
      awesome.errors.generalCatchCallback(e, `failed to calculate blockheight for url: ${url ? url : BLOCKHEIGHT_ENDPOINT}`)
    );
  let blockHeight;

  if (!blockHeightData) return "0";

  blockHeight = blockHeightData.data.data.height;

  return blockHeight;
};
