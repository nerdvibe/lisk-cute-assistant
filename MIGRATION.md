# How to migrate from Lisk Core 0.9.x to Lisk Core 1.0.x

Lisk cute assistant 2.0 has been rewritten for the Lisk Core 1.0 upgrade. The idea of the bot is still the same of Lisk-Cute-Assistant 1.0, but it has been rewritten to ensure more stability a new features.
The easiest way is to backup the config.js file, remove the `lisk-cute-assistant` folder and reinstall the bot by following the [INSTALL.md installation guide](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md)

# What changes in Lisk-Cute-Assistant 2.0?

- Support for Lisk Core 1.0 (of course)
- Refactor of the code, giving the baseline for the development of new features
- More stable checks in the cronjobs (especially in the block heights checks)
- New cronjob for checking if the server is set to forge
- Settings menu, for configure and toggle checks remotely
- Forging menu, to check if the node is set to forge.
- SMS system via TextMagic and Twilio, in order to send SMSs when something goes wront. Thanks for the awesome PR @TonyT908
- Bug fixes such as the disable of the blockheights checks while rebuilding (thanks to alepop)

# How to migrate the config.js?

So in order to migrate from Lisk-Cute-Assistant 1.0 to Lisk-Cute-Assistant 2.0 you would just need to backup the `config.js` file.

You should rewrite this fields in the new `config.js` file after the upgrade.

- `telegramAPIToken` which stays the same
- `chatId` which becomes `userId` in LCA 2.0
- `localNodeURL` which the naming of the field stays the same, but the content of the variable changes ⚠️. From `http://127.0.0.1:8000/api/loader/status/sync` it becomes `http://127.0.0.1:8000`, same goes if you are using a testnet url `http://127.0.0.1:7000/api/loader/status/sync` -> `http://127.0.0.1:7000`
- `liskPWDFolder` which stays the same

Once you backed up this fields, you are ready to delete the folder (don't forget to stop the bot with `npm stop`) and reinstall the 2.0 bot by following the [INSTALL.md installation guide](https://github.com/xunga/lisk-cute-assistant/blob/master/INSTALL.md)
