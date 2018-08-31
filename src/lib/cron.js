import awesome from "awesome_starter";
import cron from "node-cron";
import { compareBlockHeightsCron } from "./blockheights";
import { checkServerStatusCron } from "./server";
import { forgingStatusCron } from "./manageNode";
import { executeBlockHeightsCron, executeServerStatusCron, executeIsForgingCron } from "../config";

export const nodeHealthCron = cron.schedule(
  "* * * * *",
  () => {
    //Every minute
    console.log("Excuting Node Health cronjob check");
    if (executeBlockHeightsCron) {
      console.log("Checking Block Heights");
      compareBlockHeightsCron().catch(e =>
        awesome.errors.generalCatchCallback(e, "[cron]compareBlockHeights")
      );
    }
    if (executeIsForgingCron) {
      console.log("Checking Block Heights");
      forgingStatusCron().catch(e =>
        awesome.errors.generalCatchCallback(e, "[cron]forgingStatusCron")
      );
    }
  },
  false
);

export const serverStatusCron = cron.schedule(
  "* * * * *",
  () => {
    //Every minute
    if (!executeServerStatusCron) return;
    console.log("Excuting server status check");
    checkServerStatusCron().catch(e =>
      awesome.errors.generalCatchCallback(e, "[cron]compareBlockHeights")
    );
  },
  false
);

export const initializeCrons = () => {
  serverStatusCron.start();
  nodeHealthCron.start();
  console.success("Cronjobs initialized");
};


