# Partsbot Telegram Link Opener
Open PB Telegram Links

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
    "number": 2
  },
  "filters": {
    "PS5": {
      "min": 300,
      "max": 500
    },
    "XSX": {
      "min": 300,
      "max": 500
    },
    "3060": {
      "min": 200,
      "max": 600
    },
    "3060_LHR": {
      "min": 200,
      "max": 600
    },
    "3060ti": {
      "min": 200,
      "max": 600
    },
    "3060ti_LHR": {
      "min": 200,
      "max": 800
    },
    "3070": {
      "min": 200,
      "max": 900
    },
    "3070_LHR": {
      "min": 200,
      "max": 900
    },
    "3070ti_LHR": {
      "min": 200,
      "max": 900
    },
    "3080": {
      "min": 200,
      "max": 1100
    },
    "3080_LHR": {
      "min": 200,
      "max": 1100
    },
    "3080ti_LHR": {
      "min": 200,
      "max": 1100
    },
    "3090": {
      "min": 200,
      "max": 1700
    }
  }
}
```

## Update
cd ~/PB-Telegram-Linkopener  
git pull  
