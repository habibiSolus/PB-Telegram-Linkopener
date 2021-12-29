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
//const Config = require("./config.json");

const configPath = path.join(process.cwd(), './config.json');
const ConfigData = fs.readFileSync(configPath);
const Config = JSON.parse(ConfigData);

const apiId = Config.telegram.app_id;
const apiHash = Config.telegram.app_hash;
const storeSession = new StoreSession("telegram_session");



(async () => {
    
    figlet('Oizopower', function(err, data) {
        console.log(data);
        console.log("\n======================================================\n\n Partsbot - Platinum Telegram Link Opener.\n\n Donate: https://www.Ko-fi.com/oizopower\n\n======================================================");
        console.log("+ Bezig met opstarten");
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
        onError: (err) => console.log(err),
    });
    
    console.log("+ Wheeee! we zijn verbonden.");
    
    client.addEventHandler(handleMessages, new NewMessage({}));
})();

async function handleMessages(event) 
{
    const message = event.message;
    const sender = await message.getSender();
    
    const colours = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",
        
        fg: {
            black: "\x1b[30m",
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            crimson: "\x1b[38m" // Scarlet
        },
        bg: {
            black: "\x1b[40m",
            red: "\x1b[41m",
            green: "\x1b[42m",
            yellow: "\x1b[43m",
            blue: "\x1b[44m",
            magenta: "\x1b[45m",
            cyan: "\x1b[46m",
            white: "\x1b[47m",
            crimson: "\x1b[48m"
        }
    };

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

                    if( productPrice <= Config.filters[productModel][amazonCountry]['maxprice'] && Config.filters[productModel][amazonCountry]['enabled'] )
                    {

                        filterStatus = true;
                        if(amazonWareHouse)
                        {
                            if(Config.filters[productModel][amazonCountry]['useWarehouse'])
                            {
                                open(buttonLink);
                            }
                        }
                        else
                        {
                            open(buttonLink);
                        }
                    } 

                    let colourConsole = filterStatus ? colours.fg.green : colours.fg.red;

                    console.log(colourConsole, "[" + dateTime + "] ==============================================================================================================================", colours.reset); 
                    console.log(colourConsole, "[" + dateTime + "] " + productName, colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] Model: " + productModel, colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] Prijs: " + productPrice, colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] Country: " + amazonCountry, colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] WHD Status: " + (amazonWareHouse ? "Yes" : "No"), colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] ", colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] Filters", colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] Enabled: " + (Config.filters[productModel][amazonCountry]['enabled'] ? "Yes" : "No"), colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] Max Prijs: " + Config.filters[productModel][amazonCountry]['maxprice'], colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] WHD accepted: " + (Config.filters[productModel][amazonCountry]['useWarehouse'] ? "Yes" : "No"), colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] ", colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] Filter Status: " + (filterStatus ? "Accepted" : "Denied"), colours.reset);
                    console.log(colourConsole, "[" + dateTime + "] ==============================================================================================================================", colours.reset); 
                }
                else
                {
                    console.log("Button niet gevonden");
                }
            }
        }
    } 
    catch (error) 
    {
        console.log(error);
    }
}