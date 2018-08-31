import settings from "../config";
import { bot } from "./telegram";
import speakeasy from "speakeasy";

export const testAuthenticationOTP = async (otpCode, silent) => {
  const verifyObj = {
    secret: settings.OTPsecret,
    encoding: "base32",
    token: otpCode.replace(/ /g, "")
  };

  if (await speakeasy.totp.verify(verifyObj)) {
    if (!silent) bot.reply(`✅ Your password works!!`);
    return true;
  } else if (!silent) {
    bot.reply(`Oh no mate! The code doesn't match!`);
  }
  return false;
};
