# Photo Yarn

> Spin a yarn of photos with your friends

## Team

  - [Justin Cheung] (https://github.com/Jygsaw)
  - [Kyle Kraft](https://github.com/craftjk)
  - [Kia Fathi] (https://github.com/KiaFathi)
  - [Paul Yi] (https://github.com/paulyi326)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

After installing dependencies, enter the following in the root directory:

```sh
npm run watch
cordova run <platform>
```



## Requirements

- Famo.us
- Browserify
- Watchify
- Cordova with Plugins: org.apache.cordova.camera and org.apache.cordova.inAppBrowser
- jQuery


## Development

### Installing Dependencies and Getting Going

From within the root directory:

```sh
npm install -g browserify
npm install -g watchify
npm install -g cordova
npm install
```

To add cordova platforms:

```sh
cordova platform add <platform name>
```

To install cordova plugins:

```sh
cordova plugin add <plugin name>
```

### Tasks

See the projects backlog in asana [here](https://app.asana.com/0/15230281288361/15230281288361)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.