const { TelegramClient } = require("telegram");
const { StoreSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const { NewMessageEvent } = require('telegram/events/NewMessage');
const { Message } = require('telegram/tl/custom/message');

const input = require("input");
const figlet = require("figlet");
const open = require('open');
const path = require('path');
const fs = require('fs');
const { Console } = require("console");
const { exec } = require("child_process");
const log4js = require('log4js');

const configPath = path.join(process.cwd(), './config.json');
const ConfigData = fs.readFileSync(configPath);
const Config = JSON.parse(ConfigData);

const apiId = Config.telegram.app_id;
const apiHash = Config.telegram.app_hash;
const storeSession = new StoreSession("telegram_session");

const colours = {
    reset: "\x1b[0m",
    fg: {
        red: "\x1b[31m",
        green: "\x1b[32m",
    }
};

log4js.configure({
    appenders: { 
        'file': { type: 'fileSync', filename: 'logs/PB.log', maxLogSize: 10485760, numBackups: 3},
        console: { type: 'console' }
    },
    categories: { default: { appenders: ['file', 'console'], level: 'debug' } }
});

const logger = log4js.getLogger('PB'); 

let opsys = process.platform;
if (opsys == "darwin") {
    opsys = "macos";
} else if (opsys == "win32" || opsys == "win64") {
    opsys = "windows";
} else if (opsys == "linux") {
    opsys = "linux";
}

(async () => {

    figlet('Oizopower', function(err, data) {
        console.log(data);
        logger.info("\n======================================================\n\n Partsbot - Platinum Telegram Link Opener (v0.0.5)\n\n Donate: https://www.ko-fi.com/oizopower\n\n======================================================");
        logger.info("+ Bezig met opstarten");
    });
    
    const client = new TelegramClient(storeSession, apiId, apiHash, 
    {
        connectionRetries: 5,
    });
    
    await client.start({
        phoneNumber: async () => await input.text("+ Je telefoonnummer in (+31600000000): "),
        password: async () => await input.text("+ Je Telegram wachtwoord: "),
        phoneCode: async () =>
        await input.text("+ Voer de code in die je hebt ontvangen: "),
        onError: (err) => logger.info(err),
    });
    
    logger.info("+ Wheeee! we zijn verbonden.");
    console.log("=============================================================================================================================="); 
    
    client.addEventHandler(handleMessages, new NewMessage({chats: [-1001396614919,-1001165395320]}));
})();

async function handleMessages(event) 
{
    const message = event.message;
    const sender = await message.getSender();

    try {
        let titleUser = sender.title;

        if(titleUser !== undefined)
        {
            if (titleUser.includes("Direct Buy") || titleUser.includes("PartsBot Amazon Alert") || titleUser.includes("Announcements General"))
            {
                if(Config.button.number == 2)
                {
                    try{
                        buttonLink = message.replyMarkup.rows[0].buttons[Config.button.number].url;
                    } catch (error) 
                    {
                        buttonLink = message.replyMarkup.rows[0].buttons[1].url;
                    }
                }
                else
                {
                    buttonLink = message.replyMarkup.rows[0].buttons[Config.button.number].url;
                }
    
                if(buttonLink)
                {
                    let messageText = message.text;
                    let productModel = messageText.match(/Model: (.*)/i)[1];
                    let productSoldBy = messageText.match(/Sold by: (.*)/i)[1];
                    let productPriceReg = messageText.match(/Price: (.*)/i)[1];
                    let amazonCountry = productPriceReg.includes("€") ? "EUR" : "UK";
                    let productPriceTemp = productPriceReg.replace(/[^0-9+-]/g, '');
                    let productPrice = parseFloat(productPriceTemp/100);
                    let amazonWareHouse = (productSoldBy.includes("Warehouse")) ? true : false;
                    let filterStatus = false;
                    let dateTime = new Date().toLocaleString();

                    let lines = messageText.split('\n');
                    let productName = lines[lines.length - 1].replace("**","");

                    if (Config.filters.hasOwnProperty(productModel)) 
                    {
                        if (Config.filters[productModel].hasOwnProperty(amazonCountry))
                        {
                            if( productPrice <= Config.filters[productModel][amazonCountry]['maxprice'] && Config.filters[productModel][amazonCountry]['enabled'] )
                            {
                                filterStatus = true;
                                if(amazonWareHouse)
                                {
                                    if(Config.filters[productModel][amazonCountry]['useWarehouse'])
                                    {
                                        openBrowser(opsys, buttonLink);
                                    }
                                    else
                                    {
                                        filterStatus = false;
                                    }
                                }
                                else
                                {
                                    openBrowser(opsys, buttonLink);
                                }
                            } 
                        }
                    }

                    let colourConsole = filterStatus ? colours.fg.green : colours.fg.red;

                    logger.info(" " + productName);
                    logger.info(" Model: " + productModel);
                    logger.info(" Prijs: " + productPrice);
                    logger.info(" Country: " + amazonCountry);
                    logger.info(" Is WHD: " + (amazonWareHouse ? "Yes" : "No"));
                    logger.info(" ");

                    if (Config.filters.hasOwnProperty(productModel) && Config.filters[productModel].hasOwnProperty(amazonCountry))
                    {
                        logger.info(" Filters");
                        logger.info(" Enabled: " + (Config.filters[productModel][amazonCountry]['enabled'] ? "Yes" : "No"));
                        logger.info(" Max Prijs: " + Config.filters[productModel][amazonCountry]['maxprice']);
                        logger.info(" WHD accepted: " + (Config.filters[productModel][amazonCountry]['useWarehouse'] ? "Yes" : "No"));
                        logger.info(" ");
                    }

                    logger.info(" Filter Status: " + (filterStatus ? "Accepted" : "Denied"));
                    console.log("=============================================================================================================================="); 
                }
                else
                {
                    logger.info("Button niet gevonden");
                }
            }
        }
    } 
    catch (error) 
    {
        logger.warn(error);
    }
}

async function openBrowser(opsys, link) 
{

    for (var i = 0; i < Config.profiles.length; i++) {
        if(Config.profiles[i].enabled)
        {
            if(opsys == "macos")
            {
                exec('open -n -a "Google Chrome" --args --profile-directory="'+Config.profiles[i].profileName+'" "'+link+'"', (error, stdout, stderr) => {
                    if (error) {
                        logger.error(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        logger.error(`stderr: ${stderr}`);
                        return;
                    }
                });
            }
            else if (opsys == "windows")
            {
                exec('start "" chrome.exe --profile-directory="'+Config.profiles[i].profileName+'" "'+link+'"', (error, stdout, stderr) => {
                    if (error) {
                        logger.error(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        logger.error(`stderr: ${stderr}`);
                        return;
                    }
                });
            }
            else
            {
                let profileChrome = "--profile-directory=" + Config.profiles[i].profileName;
                open(link, {app: {name: "chrome", arguments: [profileChrome]}});
            }
        }
    }
}