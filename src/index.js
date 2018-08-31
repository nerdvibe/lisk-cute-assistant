// https://github.com/yagop/node-telegram-bot-api/issues/540
process.env.NTBA_FIX_319 = 1;

// Enables imports in node
require = require("esm")(module);
module.exports = require("./app.js");
