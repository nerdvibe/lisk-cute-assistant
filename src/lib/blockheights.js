import awesome from "awesome_starter";
import axios from "axios";
import settings from "../config";
import { bot } from "./telegram";
import { sendSMS } from "./sms/index";
const API_ENDPOINT = '/api/node/status';

export const getBlockHeight = async node => {
  const blockHeightData = await axios
    .get(node)
    .catch(() =>
      awesome.errors.generalCatchCallback("", "get local block height")
    );
  let blockHeight;

  if (!blockHeightData) return "0";

  blockHeight = blockHeightData.data.data.height;

  return blockHeight;
};

//used for the cronjob
//TODO: Fix potential duplicated code with respondBlockHeights()
export const compareBlockHeightsCron = async () => {
  const localBlockheight = await getBlockHeight(
    settings.localNodeURL + API_ENDPOINT
  ).catch(() =>
    awesome.errors.generalCatchCallback("", "get local block height")
  );
  let otherBlockMessage = "";
  let sameBlockHeights;
  let matchingBlockHeights = 0;

  if (localBlockheight === "0") {
    sendSMS(
      "Did not manage to get local block height during routine check for " +
        settings.nodeName
    );

    return bot.reply(
      "I didn't manage to get the local block height during the routine check!"
    );
  }

  for (let node of settings.remoteNodes) {
    let remoteNode = Object.assign({}, node);
    remoteNode.blockHeight = await getBlockHeight(node.url).catch(() =>
      awesome.errors.generalCatchCallback("", `get remote height ${node.name}`)
    );

    //compiling message
    otherBlockMessage += `\n\n<b>${remoteNode.name}</b> : ${remoteNode.blockHeight}`;

    //checking if my block height is in sync with this node
    let zero = localBlockheight - remoteNode.blockHeight;
    if (zero >= -settings.diffBlockHeight && zero <= settings.diffBlockHeight)
      matchingBlockHeights++;
  }

  // checking if the local block height is matching with the majority of the others
  const zero = matchingBlockHeights - settings.remoteNodes.length;
  sameBlockHeights = zero >= settings.minBlockHeightNodeMatch;

  if (!sameBlockHeights) {
    console.fail(
      "Detected issue: The block heights are not matching with the rest of the network"
    );
    await bot.reply(`⚠️ Detected issue while executing the routine check`, {
      parse_mode: "HTML"
    });
    await bot.reply(`<b>Local block height</b> is: ${localBlockheight}`, {
      parse_mode: "HTML"
    });
    await bot.reply(otherBlockMessage, { parse_mode: "HTML" });
    await bot.reply(
      "⚠️ Detected issue: The block heights are not matching with the rest of the network"
    );

    sendSMS(
      "Detected issue with " +
        settings.nodeName +
        ", local block height is " +
        localBlockheight
    );
  }
};

// Used for replying to user message
export const respondBlockHeights = async () => {
  const localBlockheight = await getBlockHeight(
    settings.localNodeURL + API_ENDPOINT
  ).catch(() =>
    awesome.errors.generalCatchCallback("", "get local block height")
  );
  let otherBlockMessage = "";
  let sameBlockHeights;
  let matchingBlockHeights = 0;

  if (localBlockheight === "0")
    return bot.reply("Error getting the local block height");

  console.log("Local block height is: ", localBlockheight);
  bot.reply(`<b>Local block height</b> is: ${localBlockheight}`, {
    parse_mode: "HTML"
  });

  await bot.reply(`Parsing remote nodes ✨🔎`);

  for (let node of settings.remoteNodes) {
    let remoteNode = Object.assign({}, node);
    remoteNode.blockHeight = await getBlockHeight(node.url).catch(() =>
      awesome.errors.generalCatchCallback("", `get remote height ${node.name}`)
    );

    //compiling message
    otherBlockMessage += `\n\n<b>${remoteNode.name}</b> : ${remoteNode.blockHeight}`;

    //checking if my block height is in sync with this node
    let zero = localBlockheight - remoteNode.blockHeight;
    if (zero >= -settings.diffBlockHeight && zero <= settings.diffBlockHeight)
      matchingBlockHeights++;
  }

  //publishing summary other block heights
  await bot.reply(otherBlockMessage, {
    parse_mode: "HTML"
  });

  // checking if the local block height is matching with the majority of the others
  let zero = matchingBlockHeights - settings.remoteNodes.length;
  sameBlockHeights = zero >= settings.minBlockHeightNodeMatch;

  if (sameBlockHeights) {
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
