<<<<<<< HEAD
const querystring = require("querystring");
const axios = require("axios");
const settings = require("../../config");
const sendTwilio = async (message) =>
{
  const postData = {
    'Body': message,
    'To': settings.twilioData.toPhoneNumber,
    'From': settings.twilioData.fromPhoneNumber
  };

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: settings.twilioData.username,
      password: settings.twilioData.password
    }
  };

  const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/' + settings.twilioData.username + '/Messages', querystring.stringify(postData), axiosConfig)
  .catch((err) => {
    console.log("AXIOS ERROR: ", err);
  })

  return response;
}
=======
import request from "request";
import settings from "../../config";

const sendTwilio = async message => {
  const dataString =
    "From=" +
    settings.twilioData.fromPhoneNumber +
    "&To=" +
    settings.twilioData.toPhoneNumber +
    "&Body=" +
    message;

  const options = {
    url:
      "https://api.twilio.com/2010-04-01/Accounts/" +
      settings.twilioData.username +
      "/Messages",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: dataString,
    auth: {
      user: settings.twilioData.username,
      pass: settings.twilioData.password
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  }

  request(options, callback);
};
>>>>>>> b3e9b0a8588324052e7d337482c3a51cc8b3a34c

exports.sendTwilio = sendTwilio;
