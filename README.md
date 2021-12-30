# Partsbot Telegram Link Opener
Open PB Telegram Links

## Todo
1. write logfile aswell instead of stdout 

### Download prebuild  
[Download latest prebuild](https://github.com/Oizopower/PB-Telegram-Linkopener/releases)

## Installation

### Install NodeJS and NPM (Windows)
https://nodejs.org/dist/v16.13.1/node-v16.13.1-x64.msi

### Install NodeJS and NPM (Linux)
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -  
sudo apt-get install -y nodejs  
  
### Install from source
cd ~ && git clone https://github.com/Oizopower/PB-Telegram-Linkopener && cd PB-Telegram-Linkopener  (or download zip from Github)
npm install  
edit config.json to your settings (skip profiles, not yet finished. Should be using default browser now)  
add app_id and app_hash from https://my.telegram.org/apps 

Starten met 
```
node app.js
```

```
{
  "telegram": {
    "app_id": 100000,
    "app_hash": "65faaaaaaaaaaaaaaaadddddddddddddd"
  },
  "profiles": [
    {
      "enabled": true,
      "profileName": "Default"
    },
    {
      "enabled": false,
      "profileName": "Profile 1"
    }
  ],
  "button": {
    "_comment": "Button number 0: checkout, Button number 1: Turbo, Button number 2: Extension URL",
    "number": 2
  },
  "filters": {
    "PS5": {
      "EUR": {
        "enabled": true,
        "maxprice": 500,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 500,
        "useWarehouse": true
      }
    },
    "XSX": {
      "EUR": {
        "enabled": false,
        "maxprice": 500,
        "useWarehouse": true
      },
      "UK": {
        "enabled": false,
        "maxprice": 500,
        "useWarehouse": true
      }
    },
    "1660": {
      "EUR": {
        "enabled": false,
        "maxprice": 400,
        "useWarehouse": true
      },
      "UK": {
        "enabled": false,
        "maxprice": 400,
        "useWarehouse": true
      }
    },
    "1660ti": {
      "EUR": {
        "enabled": false,
        "maxprice": 600,
        "useWarehouse": true
      },
      "UK": {
        "enabled": false,
        "maxprice": 600,
        "useWarehouse": true
      }
    },
    "3060": {
      "EUR": {
        "enabled": true,
        "maxprice": 600,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 350,
        "useWarehouse": true
      }
    },
    "3060_LHR": {
      "EUR": {
        "enabled": true,
        "maxprice": 600,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 350,
        "useWarehouse": true
      }
    },
    "3060ti": {
      "EUR": {
        "enabled": true,
        "maxprice": 800,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 450,
        "useWarehouse": true
      }
    },
    "3060ti_LHR": {
      "EUR": {
        "enabled": true,
        "maxprice": 800,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 420,
        "useWarehouse": true
      }
    },
    "3070": {
      "EUR": {
        "enabled": true,
        "maxprice": 900,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 420,
        "useWarehouse": true
      }
    },
    "3070_LHR": {
      "EUR": {
        "enabled": true,
        "maxprice": 850,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 420,
        "useWarehouse": true
      }
    },
    "3070ti": {
      "EUR": {
        "enabled": true,
        "maxprice": 850,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 420,
        "useWarehouse": true
      }
    },
    "3070ti_LHR": {
      "EUR": {
        "enabled": true,
        "maxprice": 900,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 420,
        "useWarehouse": true
      }
    },
    "3080": {
      "EUR": {
        "enabled": true,
        "maxprice": 1300,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 1150,
        "useWarehouse": true
      }
    },
    "3080_LHR": {
      "EUR": {
        "enabled": true,
        "maxprice": 1300,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 1150,
        "useWarehouse": true
      }
    },
    "3080ti": {
      "EUR": {
        "enabled": true,
        "maxprice": 1500,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 420,
        "useWarehouse": true
      }
    },
    "3080ti_LHR": {
      "EUR": {
        "enabled": true,
        "maxprice": 1500,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 420,
        "useWarehouse": true
      }
    },
    "3090": {
      "EUR": {
        "enabled": true,
        "maxprice": 2200,
        "useWarehouse": true
      },
      "UK": {
        "enabled": true,
        "maxprice": 1650,
        "useWarehouse": true
      }
    }
  }
}
```

## Update from git
cd ~/PB-Telegram-Linkopener  
git pull  
