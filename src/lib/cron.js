import awesome from "awesome_starter";
import cron from "node-cron";
import { compareBlockHeightsCron } from "./blockheights";
import { checkServerStatusCron } from "./server";
import { executeBlockHeightsCron, executeServerStatusCron } from "../config";

export const blockHeightCron = cron.schedule(
  "* * * * *",
  () => {
    //Every minute
    if (!executeBlockHeightsCron) return;
    console.success("Excuting block heights check");
    compareBlockHeightsCron().catch(e =>
      awesome.errors.generalCatchCallback(e, "[cron]compareBlockHeights")
    );
  },
  false
);

export const serverStatusCron = cron.schedule(
  "* * * * *",
  () => {
    //Every minute
    if (!executeServerStatusCron) return;
    console.success("Excuting server status check");
    checkServerStatusCron().catch(e =>
      awesome.errors.generalCatchCallback(e, "[cron]compareBlockHeights")
    );
  },
  false
);

export const initializeCrons = () => {
  serverStatusCron.start();
  blockHeightCron.start();
  console.log("Cronjobs initialized");
};
