const { TelegramClient } = require("telegram");
const { StoreSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const { NewMessageEvent } = require('telegram/events/NewMessage');
const { Message } = require('telegram/tl/custom/message');

const input = require("input");
const figlet = require("figlet");
const open = require('open');
const Config = require("./config.json");

// Settings
const apiId = Config.telegram.app_id;
const apiHash = Config.telegram.app_hash;
const storeSession = new StoreSession("telegram_session");

(async () => {
    
    await figlet('Oizopower', function(err, data) {
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
    
    try {
        let titleUser = sender.title;
        
        if(titleUser !== undefined)
        {
            if (titleUser.includes("Direct Buy") || titleUser.includes("PartsBot Amazon Alert"))
            {
                buttonLink = message.replyMarkup.rows[0].buttons[Config.button.number].url;
    
                if(buttonLink)
                {
                    let messageText = message.text;
                    let productModel = messageText.match(/Model: (.*)/i)[1];
                    let productSoldBy = messageText.match(/Sold by: (.*)/i)[1];
                    let productPriceReg = messageText.match(/Price: (.*)/i)[1];
                    let productPriceTemp = productPriceReg.replace(/[^0-9+-]/g, '');
                    let productPrice = parseFloat(productPriceTemp/100);
                    let amazonWareHouse = (productSoldBy.includes("Warehouse")) ? true : false;
                    

                    let lines = messageText.split('\n');
                    let productName = lines[lines.length - 1].replace("**","");
    
                    let MessageConsole = "Product gevonden: " + productName + " - Model: " + productModel + " - Prijs: " + productPrice;
                    
                    if( productPrice <= Config.filters[productModel]['max'] )
                    {
                        MessageConsole += " - Prijs filter: Accepted";

                        if(amazonWareHouse)
                        {
                            if(Config.useWHD)
                            {
                                open(buttonLink);
                            }
                        }
                        else
                        {
                            open(buttonLink);
                        }
                    } 
                    else 
                    {
                        MessageConsole += " - Prijs filter: Denied";
                    }
                    
                    console.log(MessageConsole);
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