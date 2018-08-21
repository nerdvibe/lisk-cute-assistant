const axios = require("axios");
const settings = require("../config");
const sendTextMagic = async (message) =>
{
  let postData = {
    'text': message,
    'phones': settings.textMagicData.phoneNumber
  };

  let axiosConfig = {
    headers: {
        'X-TM-Username': settings.textMagicData.username,
        'X-TM-Key': settings.textMagicData.APIkey
    }
  };

  const response = await axios.post('https://rest.textmagic.com/api/v2/messages', postData, axiosConfig)
  .catch((err) => {
    console.log("AXIOS ERROR: ", err);
  })

  return response;
};

exports.sendTextMagic = sendTextMagic;
