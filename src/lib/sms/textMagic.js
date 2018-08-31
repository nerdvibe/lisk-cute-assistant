import axios from "axios";
import settings from "../../config";

export const sendTextMagic = async message => {
  const postData = {
    text: message,
    phones: settings.textMagicData.phoneNumber
  };

  const axiosConfig = {
    headers: {
      "X-TM-Username": settings.textMagicData.username,
      "X-TM-Key": settings.textMagicData.APIkey
    }
  };

  const response = await axios
    .post("https://rest.textmagic.com/api/v2/messages", postData, axiosConfig)
    .catch(err => {
      console.fail("TextMagic API error: ", err);
    });

  console.success(`SMS sent via TextMagic. Message: ${message}`);

  return response;
};
