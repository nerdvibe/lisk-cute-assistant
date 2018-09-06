# Enable forging with Lisk-Cute-Assistant

Lisk-cute-assistant 2.0 introduced the possibility to enable and disable forging remotely.
We tried to come up with a solution which wouldn't store the decryption key on the server, but neither sending the complete decryption key over the wire everytime.

#### TL;DR:
- Split your decryption key in two parts: `Part_A+Part_B`
- Store Part_A of the Decryption key on the config.js
- When you need to enable forging, the bot will spin up a webpage with a form for inserting the Part_B of your key + the 2FA code.
- The bot will send you the URL of the generated webpage. The address looks like: `yourIP:portNumber/${random_string_that is refreshed_every_5_mins}`
- LCA will check the 2FA code and attempt to enable forging.



## The concept

#### How do you enable forging on Lisk Core?
With Lisk Core 1.0 it has been introduced the amazing feature of storing the encrypted delegate's passphrase on the config.json in order to enable forging.

The normal flow to start forging works like this:
- The delegate has the 12 words passphrases and has to encrypt it
- Stores the encrypted key in the config.json of the Lisk Core
- In order to enable forging, has to send a request to the server with the decryption key, which will decrypt the key and enable forging on the node.

As obvious, storing the decryption key on the server makes the whole concept of encryption useless.

#### How do you enable forging with Lisk-Cute-Assistant?

In order to not store the decryption key on the server or to not send it every time over the wire, with Lisk-Cute-Assistant you'll have to encrypt your passphrase in a special way.

The idea is to have the decryption key splitted in two parts, in which only one part is stored by the Lisk-Cute-Assistant configuration file and the other one is sent over a webpage hosted by Lisk-Cute-Assistant.
The decryption key must be splitted in two parts:
- `Part_A`
- `Part_B`

which together should form the decryption key:

`Part_A+Part_B`

-- An example --

if:
- Part_A = `rainb0ws`
- Part_B = `andUnicorns`

the Decryption Key in which you will encrypt your 12 words passphrase, will look like this:

`rainb0ws+andUnicorns`

As previously mentioned, LCA will only store the Part_A of your decryption key.
Whenever you'll want to enable forging via LCA, it will return you a webpage on which you'll insert the Part_B of your decryption key and the OTP code.



## How do you configure the config.js for the Lisk-Cute-Assistant?


Once we have our part_A and part_B, and assuming that you already started Lisk Core with the new encrypted passphrase, you'll have to configure the config.js in lisk-cute-assistant.

```
exports.enableDisableRemoteForging = true; // Make it true if you want this feature available
exports.serverIp = '1.1.1.1'; // the public IP of your server. It's needed in order to serve you the form to enable forging.
exports.serverPort = '443'; // the port on where you enable forging server will run
exports.Part_A = 'fooBar';
```

## FAQ Security

#### Why a web form and not just inserting the decryption key on Telegram?
Because the Part_B of your decryption key would be left in the chat history, which wouldn't be a good practice.
#### Why is the form always on a different url?
That's in order to prevent guessing which nodes have LCA installed or not.
#### What if the enable form url is leaked?
The form url is regenerated on every new request. If no new request is generated, the enable forging server will "turn itself off" after 5 minutes. In order to awake the enable forging server again, you'll just need to generate a new request on Telegram.
