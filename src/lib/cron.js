import awesome from "awesome_starter";
import cron from "node-cron";
import { compareBlockHeightsCron } from "./blockheights";
import { checkServerStatusCron } from "./server";
import {
  executeBlockHeightsCron,
  executeServerStatusCron
} from "../config";


export const initializeCrons = () => {
  cron.schedule("* * * * *", () => {
    //Every minute
    if (!executeBlockHeightsCron) return;
    console.success("Excuting block heights check");
    compareBlockHeightsCron().catch(e =>
      awesome.errors.generalCatchCallback(e, "[cron]compareBlockHeights")
    );
  });

  cron.schedule("* * * * *", () => {
    //Every minute
    if (!executeServerStatusCron) return;
    console.success("Excuting server status check");
    checkServerStatusCron().catch(e =>
      awesome.errors.generalCatchCallback(e, "[cron]compareBlockHeights")
    );
  });

  console.log('Cronjobs initialized');
};
