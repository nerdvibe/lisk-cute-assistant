import http from "http";
import { bot } from "../telegram";
import settings from "../../config";
import { testAuthenticationOTP } from "../auth";
import { toggleForging } from "../manageNode";

let refreshTimeout;

let enableForgingEndpoint = false;
let submitForgingEndpoint = false;
const serverURL = `${settings.serverIP}:${settings.serverPort}/`;

console.log(`http://localhost:3000/${enableForgingEndpoint}`);
console.log(submitForgingEndpoint);

http
  .createServer(function(req, res) {
    const url = req.url;

    if (enableForgingEndpoint && submitForgingEndpoint) {
      if (url === `/${enableForgingEndpoint}`) {
        const template = returnTemplate(enableForm);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(template);
        res.end();
      } else if (url === `/${submitForgingEndpoint}`) {
        let body;
        req.on("data", data => {
          console.log(data);
          body += data;
        });
        req.on("end", async () => {
          console.log("Body: " + body);
          // TODO: Parse the body
          const OTP = "";
          const part_b = "";
          const isOTPValid = await testAuthenticationOTP(OTP);

          if (isOTPValid) {
            // TODO: Test
            bot.reply("2FA valid... Will now attempt to enable forging!");
            return toggleForging(true, part_b);
          } else {
            bot.reply("Oh no! The OTP code was not valid...");
          }
        });
        res.writeHead(200, { "Content-Type": "text/html" });
        const template = returnTemplate(success);
        res.write(template);
        res.end();
      }
    }

    // else{
    // res.write('<h1>Hello World!<h1>'); //write a response
    // res.end(); //end the response
    // }
  })
  .listen(settings.serverPort, () => {
    console.log(`server start at port ${settings.serverPort}`);
  });

export const disableServer = () => {
  clearTimeout(refreshTimeout);
  enableForgingEndpoint = false;
  submitForgingEndpoint = false;
  bot.reply("🖥 Server for enabling forging turned off");
};

// enables the server for 5 minutes
const startServer = async () => {
  clearTimeout(refreshTimeout);
  await bot.reply("🖥 Turning on server for server for enabling forging");

  enableForgingEndpoint =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  submitForgingEndpoint =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  await bot.reply(
    `To enable forging, please insert the part_B of the decryption key together with your OTP code here: ${serverURL}:${enableForgingEndpoint}`
  );

  refreshTimeout = setTimeout(disableServer, 1000 * 60 * 5); // 5 minutes
};
