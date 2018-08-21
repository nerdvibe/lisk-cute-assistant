var request = require('request');
const settings = require("../config");  
const sendTwilio = async (message) =>
{
  const dataString = 'From='+settings.twilioData.fromPhoneNumber+'&To='+settings.twilioData.toPhoneNumber+'&Body='+message;

  var options = {
      url: 'https://api.twilio.com/2010-04-01/Accounts/'+settings.twilioData.username+'/Messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: dataString,
      auth: {
          'user': settings.twilioData.username,
          'pass': settings.twilioData.password
      }
  };

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body);
      }
  }

  request(options, callback);
}

exports.sendTwilio = sendTwilio;
