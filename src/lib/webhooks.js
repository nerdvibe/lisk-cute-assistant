import axios from 'axios';
import { slackWebhook, webhook, nodeName } from '../config';

export const sendToSlackWebhook = (message) => {
  if (!slackWebhook.url) {
    return
  }
  const options = {
    text: `[${nodeName}] ${message}`,
    channel: slackWebhook.channel,
    username: slackWebhook.botName,
    icon_emoji: slackWebhook.icon_emoji
  };

  axios.post(slackWebhook.url, JSON.stringify(options))
    .catch((error) => {
      console.fail('FAILED: Send slack slackWebhook', message, error);
    });
};

export const sendToWebhook = (eventName) => {
  if (!webhook.url) {
    return
  }

  const options = {
    value_1: `[${nodeName}]`,
  };

  axios.post(webhook.url.replace('{event}', 'lca_' + eventName), JSON.stringify(options))
    .catch((error) => {
      console.fail('FAILED: Send Webhook', eventName, error);
    });
};
