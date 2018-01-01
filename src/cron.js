const awesome = require("awesome_starter");
const cron = require('node-cron');
const {compareBlockHeightsCron} = require('./lib/blockheights');
const {checkServerStatusCron} = require('./lib/server');
const {executeBlockHeightsCron, executeServerStatusCron} = require('./config');


cron.schedule('* * * * *', () => { //Every minute
  if(!executeBlockHeightsCron)
    return;
  console.success('Excuting block heights check');
  compareBlockHeightsCron().catch((e) => awesome.errors.generalCatchCallback(e, '[cron]compareBlockHeights'));
});

cron.schedule('* * * * *', () => { //Every minute
  if(!executeServerStatusCron)
    return;
  console.success('Excuting server status check');
  checkServerStatusCron().catch((e) => awesome.errors.generalCatchCallback(e, '[cron]compareBlockHeights'));
});
