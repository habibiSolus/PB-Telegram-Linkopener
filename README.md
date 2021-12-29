# Partsbot Telegram Link Opener
Open PB Telegram Links

## Todo
1. multiple profiles   

## Installation

### Install NodeJS and NPM (Windows)
https://nodejs.org/dist/v16.13.1/node-v16.13.1-x64.msi

### Install NodeJS and NPM (Linux)
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -  
sudo apt-get install -y nodejs  
  
### Install the package  
cd ~ && git clone https://github.com/Oizopower/PB-Telegram-Linkopener && cd PB-Telegram-Linkopener  
npm install  
edit config.json to your settings  
add app_id and app_hash from https://my.telegram.org/apps 

Starten met 
```
node app.js
```

```
{
  "telegram": {
     "app_id": ,
     "app_hash": ""
  },
  "profiles": {
    "profile1": {
      "browser": "google chrome",
      "profileName": null
    }
  },
  "button": {
    "number": 1
  },
  "filters": {
    "PS5": {
      "max": 500
    },
    "XSX": {
      "max": 500
    },
    "3060": {
      "max": 600
    },
    "3060_LHR": {
      "max": 600
    },
    "3060ti": {
      "max": 600
    },
    "3060ti_LHR": {
      "max": 800
    },
    "3070": {
      "max": 900
    },
    "3070_LHR": {
      "max": 900
    },
    "3070ti_LHR": {
      "max": 900
    },
    "3080": {
      "max": 1100
    },
    "3080_LHR": {
      "max": 1100
    },
    "3080ti_LHR": {
      "max": 1100
    },
    "3090": {
      "max": 1700
    }
  }
}
```

## Update
cd ~/PB-Telegram-Linkopener  
git pull  
