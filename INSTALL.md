# How to install lisk-cute-assistant

#### Index
- [Pre-requisites](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#pre-requisites)
  - [Telegram API Token](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#telegram-api)
  - [Dependencies](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#dependencies)
     - [Git](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#git)
     - [Node](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#node)

- [Installation](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#lets-install)
  - [Mainnet](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#mainnet)
  - [Testnet](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md#testnet)

## Pre-requisites

### Telegram API Token
For the installation you will need to create a bot for Telegram. Here is how to do it:
 - Search for the [@BotFather](https://telegram.me/BotFather) on Telegram ![image](https://raw.githubusercontent.com/xunga/lisk-cute-assistant/master/imgs/install/step1_search.png)
 - Send a `/newbot` command to the BothFather  ![image](https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/install/step2_chat.png?raw=true)
 - Answer the questions and then the BotFather will give you an HTTP API key that looks like this: `12345678:Lett3rsAndNumb3rs`

For now we are done with Telegram. Keep that API key, we'll use it later...

### Dependencies
You will need to install Git and NodeJS. For convenience we'll be using [NVM](https://github.com/creationix/nvm) for installing node and Assume that you are installing `lisk-cute-assistant` on Ubuntu.
You don't need to run this commands if you already have Git and Node installed. Install only the missing dependencies.

#### Git
- Install Git `sudo apt-get install git`

#### Node
- Install [NodeJS via NVM](https://github.com/creationix/nvm) `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
- If you just installed NVM, you'll need it to make NVM executable by running:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
- Let's install node `nvm install v8.9.4`

Done with the pre-requisites

--------

## Let's install

### Mainnet

- Access your node
- Clone the repository `git clone https://github.com/xunga/lisk-cute-assistant`
- Access the folder `cd lisk-cute-assistant/`
- Install the node packages `npm install`
- Copy the and rename the sample config `cp src/config_sample.js src/config.js`
- Time to generate a One Time Passwor to add to Google Authenticator. Run `npm run generate-password`. This script returns you a QR-Code and a secret.
- Scan the QR-Code with Google Authenticator 

![image](https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/install/step3_generate_qr.png?raw=true)
- Copy the generated secret and paste into the variable `exports.OTPsecret` inside the `src/config.js` file.
- Copy the previously generated telegram API into the variable `exports.telegramAPIToken` inside the `src/config.js` file.
- Now we can get the telegram user id... We can run `npm start`
- Write to your bot and it will return your telegram user id. Copy this user id into the variable `exports.user`Id inside the `src/config.js` file.

![image](https://github.com/xunga/lisk-cute-assistant/blob/master/imgs/install/step4_get_chatid.png?raw=true)
- Check the rest of the `src/config.js` file, if everything is right or if you want to fine tune it.
- You should be almost ready to go! We just need to stop the bot. Run `npm stop`.
- Congratulations! We just need to start the bot. `npm start`

Now the bot should send you a welcome message and you should be all settled. Is a good practice to the test if the OTP password works by sending the command `/test OTP_PASSWORD`.


### Testnet

Follow the same process of Mainnet and make the following changes when installing.

- When copying the config_sample, use `cp src/config_sample.js_testnet src/config.js`. Double check the file and edit accordingly.
- Inside the `src/consts.js` replace the **GREENDRAGON_MAIN:** url with `https://testnet-snapshot.lisknode.io`
