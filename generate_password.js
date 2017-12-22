let speakeasy = require("speakeasy");
let qrcode = require("qrcode-terminal");
let secret = speakeasy.generateSecret({ name: "lisk-cute-assistant" });

console.log("\n\n");
console.log("This is your secret: (just fyi...) \n ");
console.log(secret);

console.log("\n\n\n\n");
console.log(
  "Scan the following QR code with your 2FA app (e.g. Google Authenticator)"
);
console.log("\n\n\n\n");
qrcode.generate(secret.otpauth_url);

console.log("\n\n\n\n");
console.log(
  "If you have problems in scanning the QR code (you know, the terminal is not the best for QR codes :) ), copy this URL in your 2FA app:\n",
  secret.otpauth_url
);

console.log("\n\n");
console.log(
  "Now insert in the config.js file the following secret: ",
  secret.base32
);
console.log("\n\n");

console.log(
  "By now you should have set up the One time password in your 2FA app and the secret configured in the config.js"
);
console.log(
  'You can verify that your code really works, by sending a message to your bot "/test PASSWORD_FROM_AUTH_APP"'
);
console.log("\n\n");
