const sendTextMagic = async (message) =>
{
  const axios = require("axios");
  const settings = require("../config");
  var postData = {
    'text': message,
    'phones': settings.textMagicData.phoneNumber
  };

  let axiosConfig = {
    headers: {
        'X-TM-Username': settings.textMagicData.username,
        'X-TM-Key': settings.textMagicData.APIkey
    }
  };

  axios.post('https://rest.textmagic.com/api/v2/messages', postData, axiosConfig)
  .then((res) => {
    console.log("RESPONSE RECEIVED: ", res);
  })
  .catch((err) => {
    console.log("AXIOS ERROR: ", err);
  })
};

exports.sendTextMagic = sendTextMagic;