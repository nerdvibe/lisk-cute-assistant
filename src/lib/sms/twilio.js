const querystring = require("querystring");
const axios = require("axios");
const settings = require("../../config");

export const sendTwilio = async message => {
  const postData = {
    Body: message,
    To: settings.twilioData.toPhoneNumber,
    From: settings.twilioData.fromPhoneNumber
  };

  const axiosConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    auth: {
      username: settings.twilioData.username,
      password: settings.twilioData.password
    }
  };

  const response = await axios
    .post(
      `https://api.twilio.com/2010-04-01/Accounts/${settings.twilioData.username}/Messages`,
      querystring.stringify(postData),
      axiosConfig
    )
    .catch(err => {
      console.fail("AXIOS ERROR: ", err);
    });

  console.success(`SMS sent via Twilio. Message: ${message}`);

  return response;
};
