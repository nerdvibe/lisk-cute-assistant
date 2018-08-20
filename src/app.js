import settings from "./config";
import { initializeCrons } from "./lib/cron";
import { initializeMenu } from './lib/menu'

console.log(`

  _     _     _                            
 | |   (_)___| | __                        
 | |   | / __| |/ /                        
 | |___| \\__ \\   <                         
 |_____|_|___/_|\\_\\    
    ___      _           
  / ___|   _| |_ ___                       
 | |  | | | | __/ _ \\                      
 | |__| |_| | ||  __/                      
  \\____\\__,_|\\__\\___|   
                  _     _              _
    / \\   ___ ___(_)___| |_ __ _ _ __ | |_ 
   / _ \\ / __/ __| / __| __/ _\` | '_ \\| __|
  / ___ \\\\__ \\__ \\ \\__ \\ || (_| | | | | |_
 /_/   \\_\\___/___/_|___/\\__\\__,_|_| |_|\\__|




  Telegram Bot running only for ${settings.chatId}
  OTP secret is ${settings.OTPsecret}

 `);


initializeCrons();
initializeMenu();
