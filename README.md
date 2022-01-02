# Partsbot Telegram Link Opener
Open PB Telegram Links

## Download latest prebuilds  
[Download latest prebuild](https://github.com/Oizopower/PB-Telegram-Linkopener/releases)

###
- Advanced filtering
- Specify UK and EU in filter with seperate prices
- Multiple Profiles for Chrome
- Prebuilds, no need to run from source
- Remove product from config and it skips the product
- Send message to self on Telegram on successful open
- Show latest version in startup

## Installation from source   

### Install NodeJS and NPM (Windows)
https://nodejs.org/dist/v16.13.1/node-v16.13.1-x64.msi

### Install NodeJS and NPM (Linux)
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -  
sudo apt-get install -y nodejs  
  
### Install from source
git clone https://github.com/Oizopower/PB-Telegram-Linkopener && cd PB-Telegram-Linkopener  (or download zip from Github)
npm install  
edit config.json to your settings
add app_id and app_hash from https://my.telegram.org/apps 
Change Chrome profile names (Use Default for default one, Profile 1 for first created profile, Profile 2 for second created profile etc)


Start with
```
node app.js
```

## config.json configuration
See config.json.sample for examples and new settings [here](config.json.sample)


## Update from git
cd ~/PB-Telegram-Linkopener  
git pull  
npm update   
