const awesome = require("awesome_starter");
const axios = require("axios");
const settings = require("../config");
const { bot } = require("./telegram");

const getBlockHeight = async node => {
  const blockHeightData = await axios
    .get(node)
    .catch(() =>
      awesome.errors.generalCatchCallback("", "get local block height")
    );
  let blockHeight;

  if (!blockHeightData) return "0";

  blockHeight = blockHeightData.data.height;

  return blockHeight;
};

//used for the cronjob
//TODO: Fix potential duplicated code with respondBlockHeights()
const compareBlockHeightsCron = async () => {
  const localBlockheight = await getBlockHeight(
    settings.localNodeURL
  ).catch(() =>
    awesome.errors.generalCatchCallback("", "get local block height")
  );
  let otherBlockMessage = "";
  let sameBlockHeights;
  let matchingBlockHeights = 0;

  if (localBlockheight === "0")
    return bot.sendMessage(
      settings.chatId,
      "I didn't manage to get the local block height during the routine check!"
    );

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
  let zero = settings.remoteNodes.length - matchingBlockHeights;
  sameBlockHeights = zero >= settings.minBlockHeightNodeMatch;
  if (!sameBlockHeights) {
    console.fail(
      "Detected issue: The block heights are not matching with the rest of the network"
    );
    bot.sendMessage(
      settings.chatId,
      `⚠️ Detected issue while executing the routine check`,
      { parse_mode: "HTML" }
    );
    bot.sendMessage(
      settings.chatId,
      `<b>Local block height</b> is: ${localBlockheight}`,
      { parse_mode: "HTML" }
    );
    bot.sendMessage(settings.chatId, otherBlockMessage, { parse_mode: "HTML" });
    bot.sendMessage(
      settings.chatId,
      "⚠️ Detected issue: The block heights are not matching with the rest of the network"
    );
  }
};

// Used for replying to user message
const respondBlockHeights = async () => {
  const localBlockheight = await getBlockHeight(
    settings.localNodeURL
  ).catch(() =>
    awesome.errors.generalCatchCallback("", "get local block height")
  );
  let otherBlockMessage = "";
  let sameBlockHeights;
  let matchingBlockHeights = 0;

  if (localBlockheight === "0")
    return bot.sendMessage(
      settings.chatId,
      "Error getting the local block height"
    );

  console.log("Local block height is: ", localBlockheight);
  bot.sendMessage(
    settings.chatId,
    `<b>Local block height</b> is: ${localBlockheight}`,
    { parse_mode: "HTML" }
  );

  await bot.sendMessage(settings.chatId, `Parsing remote nodes ✨🔎`);

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
  await bot.sendMessage(settings.chatId, otherBlockMessage, {
    parse_mode: "HTML"
  });

  // checking if the local block height is matching with the majority of the others
  let zero = settings.remoteNodes.length - matchingBlockHeights;
  sameBlockHeights = zero >= settings.minBlockHeightNodeMatch;
  if (sameBlockHeights) {
    console.success("Your node seems to have the correct height");
    bot.sendMessage(
      settings.chatId,
      "👌 Your node seems to have the correct height"
    );
  } else {
    console.fail(
      "The block heights are not matching with the rest of the network"
    );
    bot.sendMessage(
      settings.chatId,
      "😡 The block heights are not matching with the rest of the network"
    );
  }
};

exports.getBlockHeight = getBlockHeight;
exports.compareBlockHeightsCron = compareBlockHeightsCron;
exports.respondBlockHeights = respondBlockHeights;
