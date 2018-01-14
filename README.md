# Lisk Cute Assistant


![Lisk-Cute-Assistant](https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/lisk-cute-assistant.png?raw=true)

### Lisk Cute Assistant is a bot to manage your Lisk Node remotely from Telegram.

Lisk Cute Assistant enables the node owners to remotely manage it, via telegram. The code is self hosted on the same instance of the lisk node and it configures the telegram bot to only reply to requests only from a given telegram ID.

Since some operations are sensitive, it uses One Time Passwords (OTP) to authenticate the requests.

Lisk-cute-assistant doesn't perform any kind of automatic operation besides checking the health of the node/server. E.g. if your node forks, it will not automatically fix it, but instead it will give you the possibility of rebuilding the node from telegram, after executing the authentication.

## Features

- Block height check, comparing it to other nodes
- Server stats
- Remote rebuild from snapshot server
- Logs tailing & logs grep
- Minute by minute cronjobs to check the node health
- Authentication of requests via OTP (e.g. 2FA passwords from Google Authenticator) for sensitive tasks such as the rebuild

## How to run

- Clone the project in your lisk node instance
- Install the required packges with `npm install`
- We need to generate a secret to add in your OTP generator (e.g. Google Authenticator) via `npm run generate-password`
- Scan the QR Code with your Google Authenticator app
- Take note of the secret, we'll use it in the next step
- Create a `src/config.js` file from `src/config_sample.js` and here insert the secret previously generated in the `OTPsecret`variable and leave the `chatId` var empty. In order to generate a telegram API, you'll need to get in touch with the Botfather. [Follow this tutorial if it's the first time ](https://core.telegram.org/bots#3-how-do-i-create-a-bot).
- Run the application with `npm run`. 
- Send a `/start` message to your bot on telegram. The bot will reply to your message with your telegram id.
- Add your telegram id in the 'chatId' var in 'src/config.js'
- You are ready to go! Run the application in the background (TODO: Add example)

## Functionalities

### Block Heights

It tests your blockheight against the other nodes configured in the `config.js` file

### Server status

Returns the CPU/RAM usage, available space and the lisk process status

### Rebuild from snapshot

It rebuilds the node via the command `bash lisk.sh rebuild -u ${selected_snapshot_server_URL} -f latest.gz`

### Get logs

Opens a new keyboard that enables to: 
- Tail the logs. Yes it opens a stream from your log file with your chat. It batches the logs and sends them every second
- Get recent logs. A single message sent once, with your last logs (tail -n 3000)
- Grep of logs. You can grep the following:
 - Forks cause 1
 - Forks cause 2
 - Forks cause 3
 - Forks cause 4
 - Forks cause 5
 - All forks
 - SIGKILL
 - SIGABERT
 - "Consensus"
 
## Security

The bot is programmed in a way that it only replies to your requests. For certain tasks like the rebuild flow, it requests a [One Time Password](https://en.wikipedia.org/wiki/One-time_password) in order to perform the action.

## Screenshots
<img src="https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/screen0.jpg?raw=true" data-canonical-src="https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/screen0.jpg?raw=true" width="400" />   <img src="https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/screen1.jpg?raw=true" data-canonical-src="https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/screen1.jpg?raw=true" width="400" />


### Todos
- Add the possibility to do active log monitoring. Needs to be performance checked
- Multi node management (thanks @alepop)

# Built with ❤️ by [Carbonara](lisk://main/voting/vote?votes=carbonara) and [Lisk Elite](http://liskelite.com)
