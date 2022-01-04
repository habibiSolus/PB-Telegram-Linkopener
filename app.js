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
const { exec } = require("child_process");
const log4js = require('log4js');
const fetch = require('node-fetch');

const liner = "===================================================================================================================";
const productCooldown = {};

if(!checkFileExistsSync(path.join(process.cwd(), './config.json')))
{
    console.error("config.json not found, copy and change config.json.sample to config.json");
    return;
}

const configPath = path.join(process.cwd(), './config.json');
const ConfigData = fs.readFileSync(configPath);
const Config = JSON.parse(ConfigData);

const apiId = Config.telegram.app_id;
const apiHash = Config.telegram.app_hash;
const storeSession = new StoreSession("telegram_session");

var dir = path.join(process.cwd(), '/logs');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
}

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

const client = new TelegramClient(storeSession, apiId, apiHash, 
{
    connectionRetries: 5,
});

(async () => {

    let versionInfo = await checkGithubVersion();

    figlet('Oizopower', function(err, data) {
        console.log(data);
        console.log("\n======================================================\n\n Partsbot - Platinum Telegram Link Opener (v"+versionInfo.local+" Remote-latest: v"+versionInfo.github+")\n\n Donate: https://www.ko-fi.com/oizopower\n\n======================================================");
        console.log("+ Bezig met opstarten");
    });
    
    await client.start({
        phoneNumber: async () => await input.text("+ Je telefoonnummer in (+31600000000): "),
        password: async () => await input.text("+ Je Telegram wachtwoord: "),
        phoneCode: async () =>
        await input.text("+ Voer de code in die je hebt ontvangen: "),
        onError: (err) => logger.info(err),
    });
    
    console.log("+ Wheeee! we zijn verbonden.");
    console.log(liner);
    
    setTimeout(() => {
        printMemoryUsage();    
    }, 2000);
    

    /**
     * TEST = 1165395320
     * PB = 1396614919
     * PB2 = 1647685570
     *  */ 

    let listChats = [1396614919, 1165395320]

    if(Config.hasOwnProperty("PartsBot2") && Config.PartsBot2.enabled)
    {
        listChats.push(1647685570)
    }

    client.addEventHandler(handleMessages, new NewMessage({chats: listChats}));
})();

async function handleMessages(event) 
{
    const message = event.message;
    const sender = await message.getSender();
    const buttonLink = [];

    try {
        let titleUser = sender.title;

        if(titleUser !== undefined)
        {
            const isPB2 = (titleUser == "PartsBot - Direct Buy 2" || titleUser.includes("Announcements General")) ? true : false;

            if (titleUser.includes("Direct Buy") || titleUser.includes("PartsBot Amazon Alert") || titleUser.includes("Announcements General"))
            {
                // Make array of all possible buttons
                try{
                    buttonLink.push(message.replyMarkup.rows[0].buttons[0].url);
                } catch (error) {
                    logger.warn(" Button 1 does not exists on this alert");
                }

                if(buttonLink.length > 0)
                {
                    try{
                        buttonLink.push(message.replyMarkup.rows[0].buttons[1].url);
                    } catch (error) {
                        buttonLink.push(message.replyMarkup.rows[0].buttons[1].url);
                        logger.warn(" Button 2 does not exists on this alert, using button 1 as fallback for button 2");
                    }
    
                    try{
                        buttonLink.push(message.replyMarkup.rows[0].buttons[2].url);
                    } catch (error) {
                        buttonLink.push(message.replyMarkup.rows[0].buttons[1].url);
                        logger.warn(" Button 3 does not exists on this alert, using button 2 as fallback for button 3");
                    }

                    let messageText = message.text;

                    let productPriceReg = messageText.match(/Price: (.*)/i)[1];
                    let amountDecimals = countDecimals(productPriceReg.replace(/[^0-9.,+-]/g, ''));
                    let productPriceTemp = productPriceReg.replace(/[^0-9+-]/g, '');

                    if(amountDecimals === 1)
                    {
                        productPriceTemp = parseInt(productPriceTemp + "0")
                    }

                    let lines = messageText.split('\n');
                    let productSoldBy = (!isPB2 ? messageText.match(/Sold by: (.*)/i)[1] : "");

                    let productData = {
                        "productModel": !isPB2 ? messageText.match(/Model: (.*)/i)[1] : "",
                        "productSoldBy": productSoldBy,
                        "amazonCountry": productPriceReg.includes("€") ? "EUR" : "UK",
                        "productPrice": parseFloat(productPriceTemp/100),
                        "amazonWareHouse": (productSoldBy.includes("Warehouse")) ? true : false,
                        "dateTime": new Date().toLocaleString(),
                        "productName": !isPB2 ? lines[lines.length - 1].replace(/\*\*/g,"") : lines[lines.length - 1].replace(/\[.*?\]/g, "").replace(/\*\*/g,"").trim(),
                        "website": lines[0].replace(/\*\*/g,""),
                        "source": false,
                        "chanTitle": titleUser
                    }

                    if(isPB2 && Config.hasOwnProperty("PartsBot2"))
                    {
                        // alternate Filtering.
                        let PB2_ProductTitle = productData.productName.toLowerCase()

                        let PB2Filters = Config.PartsBot2.filters;
                        let PB2RegArray = [];

                        for (var key in PB2Filters) {
                            if (PB2Filters.hasOwnProperty(key)) {
                                PB2RegArray.push(key);
                            }
                        }

                        let PB2Reg = RegExp("(" + PB2RegArray.join("|") + ")", 'i');
                        let PB2Model = PB2_ProductTitle.match(PB2Reg);

                        if(PB2Model != null)
                        {
                            if(PB2Filters.hasOwnProperty(PB2Model[0]))
                            {
                                productData.productModel = PB2Filters[PB2Model[0]];
                            }
                        }

                        let source = messageText.match(/Source: (.*)/i);

                        if(source != null) {
                            productData.source = source[1];
                        }
                    }

                    // cooldown timers
                    if(Config.hasOwnProperty("cooldownTimer"))
                    {
                        if(productCooldown.hasOwnProperty(productData.productName + productPriceTemp) && 
                        Date.now()-productCooldown[productData.productName + productPriceTemp] < Config.cooldownTimer*1000)
                        {
                            logger.error("PRODUCT ON COOLDOWN TIMER: " + productData.productName);
                            console.log(liner);
                            return;
                        }
                        else
                        {
                            productCooldown[productData.productName + productPriceTemp] = Date.now();
                        }
                    }
                    else
                    {
                        logger.warn(" Cooldown timer not found in config.json, please update your config (see latest config.json.sample)");
                        console.log(liner);
                    }

                    
                    
                    // start normal filters
                    let filterStatus = false;

                    if (Config.filters.hasOwnProperty(productData.productModel)) 
                    {
                        if (Config.filters[productData.productModel].hasOwnProperty(productData.amazonCountry))
                        {
                            if( productData.productPrice <= Config.filters[productData.productModel][productData.amazonCountry]['maxprice'] && Config.filters[productData.productModel][productData.amazonCountry]['enabled'] )
                            {
                                filterStatus = true;
                                if(productData.amazonWareHouse)
                                {
                                    if(Config.filters[productData.productModel][productData.amazonCountry]['useWarehouse'])
                                    {
                                        openBrowser(opsys, buttonLink, productData);
                                    }
                                    else
                                    {
                                        filterStatus = false;
                                    }
                                }
                                else
                                {
                                    openBrowser(opsys, buttonLink, productData);
                                }
                            } 
                        }
                    }

                    logger.info(" " + productData.productName);
                    logger.info(" ");
                    logger.info(" Channel: " + productData.chanTitle + (productData.source ? " (Source TG: " + productData.source + ")" : ""));
                    logger.info(" Website: " + productData.website);
                    if(productData.productModel) logger.info(" Model: " + productData.productModel);
                    logger.info(" Price: " + productData.productPrice);
                    logger.info(" Country: " + productData.amazonCountry);
                    logger.info(" Is WHD: " + (!isPB2 ? (productData.amazonWareHouse ? "Yes" : "No") : "Unknown"));
                    logger.info(" ");

                    logger.info(" Filters");
                    if (Config.filters.hasOwnProperty(productData.productModel) && Config.filters[productData.productModel].hasOwnProperty(productData.amazonCountry))
                    {
                        logger.info(" Enabled: " + (Config.filters[productData.productModel][productData.amazonCountry]['enabled'] ? "Yes" : "No") + ", Max Price: " 
                        + Config.filters[productData.productModel][productData.amazonCountry]['maxprice'] + ", WHD accepted: " 
                        + (Config.filters[productData.productModel][productData.amazonCountry]['useWarehouse'] ? "Yes" : "No"));
                    }
                    else {
                        logger.info(" No filters found in config");
                    }
                    logger.info(" ");
                    
                    if (Config.filters.hasOwnProperty(productData.productModel) && 
                        Config.filters[productData.productModel].hasOwnProperty("advanced") && 
                        Config.filters[productData.productModel]["advanced"].hasOwnProperty("buttons"))
                    {
                        logger.info(" Advanced filters:");
                        logger.info(" Use multiple buttons: " + (Config.filters[productData.productModel]["advanced"]["buttons"]["enableMultipleButtons"] ? "Yes" : "No") + ", Custom buttons: " 
                        + Config.filters[productData.productModel]["advanced"]["buttons"]["overrideButtons"]);
                        logger.info(" ");
                    }
                    
                    logger.info(" Filter Status: " + (filterStatus ? "\x1b[32mAccepted\x1b[0m" : "\x1b[31mDenied\x1b[0m"));
                    console.log(liner);
                }
                else
                {
                    logger.warn("Button niet gevonden");
                }
            }
        }
    } 
    catch (error) 
    {
        logger.warn(error);
    }
}

async function openBrowser(opsys, buttonLink, productData) 
{
    for (var i = 0; i < Config.profiles.length; i++) 
    {
        if(Config.profiles[i].enabled)
        {
            if (Config.filters.hasOwnProperty(productData.productModel) && 
                Config.filters[productData.productModel].hasOwnProperty("advanced") && 
                Config.filters[productData.productModel]["advanced"].hasOwnProperty("buttons")
                && Config.filters[productData.productModel]["advanced"]["buttons"]["enableMultipleButtons"])
            {
                let multipleLinks = Config.filters[productData.productModel]["advanced"]["buttons"]["overrideButtons"];
                for(var j = 0; j < multipleLinks.length; j++)
                {
                    if(opsys == "macos")
                    {
                        exec('open -n -a "Google Chrome" --args --profile-directory="'+Config.profiles[i].profileName+'" "'+buttonLink[multipleLinks[j]]+'"', (error, stdout, stderr) => {
                            if (error) {
                                logger.warn(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                logger.warn(`stderr: ${stderr}`);
                                return;
                            }
                        });
                    }
                    else if (opsys == "windows")
                    {
                        exec('start "" chrome.exe --profile-directory="'+Config.profiles[i].profileName+'" "'+buttonLink[multipleLinks[j]]+'"', (error, stdout, stderr) => {
                            if (error) {
                                logger.warn(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                logger.warn(`stderr: ${stderr}`);
                                return;
                            }
                        });
                    }
                    else
                    {
                        let profileChrome = "--profile-directory=" + Config.profiles[i].profileName;
                        open(buttonLink[multipleLinks[j]], {app: {name: "chrome", arguments: [profileChrome]}});
                    }

                    if(Config.telegram.notifySelf !== undefined && Config.telegram.notifySelf)
                    {
                        await client.sendMessage('me',{
                            message:"Following product opened on Telegram Link Opener: \nProduct: " + productData.productName + "\nURL: " + buttonLink[multipleLinks[j]]
                        });
                    }
                }
            }
            else
            {
                if(opsys == "macos")
                {
                    exec('open -n -a "Google Chrome" --args --profile-directory="'+Config.profiles[i].profileName+'" "'+buttonLink[Config.button.number]+'"', (error, stdout, stderr) => {
                        if (error) {
                            logger.warn(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            logger.warn(`stderr: ${stderr}`);
                            return;
                        }
                    });
                }
                else if (opsys == "windows")
                {
                    exec('start "" chrome.exe --profile-directory="'+Config.profiles[i].profileName+'" "'+buttonLink[Config.button.number]+'"', (error, stdout, stderr) => {
                        if (error) {
                            logger.warn(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            logger.warn(`stderr: ${stderr}`);
                            return;
                        }
                    });
                }
                else
                {
                    let profileChrome = "--profile-directory=" + Config.profiles[i].profileName;
                    open(buttonLink[Config.button.number], {app: {name: "chrome", arguments: [profileChrome]}});
                }

                if(Config.telegram.notifySelf !== undefined && Config.telegram.notifySelf)
                {
                    await client.sendMessage('me',{
                        message:"Following product opened on Telegram Link Opener: \nProduct: " + productData.productName + "\nURL: " + buttonLink[Config.button.number]
                    });
                }
            }

            
        }
    }
}

async function checkGithubVersion()
{
    /* Local version */
    const packageFilePath = path.join(__dirname, './package.json');
    const packageFile = fs.readFileSync(packageFilePath);
    const package = JSON.parse(packageFile);

    const response = await fetch('https://api.github.com/repos/Oizopower/PB-Telegram-Linkopener/releases/latest', {
        headers: 
        {
            'Content-Type': 'application/json',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        }
    });
    
    const data = await response.json();
    return {'local': package.version, 'github': data.tag_name};
}

function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fs.accessSync(filepath, fs.constants.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
}

function countDecimals(value) {
    if(Math.floor(value.valueOf()) === value.valueOf()) return 0;
    return value.toString().split(".")[1].length || 0; 
}

function printMemoryUsage()
{
    let mem = process.memoryUsage();
    logger.mark(" MEMORY USAGE - RSS: " + mem.rss + " | HEAPTOTAL: " + mem.heapTotal + " | HEAPUSED: " + mem.heapUsed + " | EXTERNAL: " + mem.external + " | ARRAYBUFFERS: " + mem.arrayBuffers )
    console.log(liner);
}

setInterval(printMemoryUsage, 60 * 60 * 1000);