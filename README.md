
# zBot Discord Bot - Game Server Status and Information

## Introduction

The "zBot" Discord bot is a custom bot designed to display the status and information of a game server in a Discord server. The bot uses Telnet to retrieve server information and displays it in specific categories on the Discord server.

## Requirements

Before installing the bot, make sure your system meets the following requirements:

-   Node.js (version 12 or higher)
-   A game server compatible with Telnet
-   A Discord server and a Discord bot account

## Installation

1.  Clone the bot's repository from GitLab to your local machine:

bashCopy code

`git clone https://gitlab.com/your-username/zBot.git` 

2.  Navigate to the bot's directory:

bashCopy code

`cd zBot` 

3.  Install the project's dependencies using npm:

bashCopy code

`npm install` 

## Configuration

1.  Create a `config.json` file in the bot's directory with the following information:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "server_status_channel_id": "SERVER_STATUS_CHANNEL_ID",
  "time_display_category_id": "TIME_DISPLAY_CATEGORY_ID",
  "remaining_time_before_BM": "REMAINING_TIME_BM_CATEGORY_ID",
  "game_server_address": "GAME_SERVER_IP_ADDRESS",
  "game_server_port": "GAME_SERVER_PORT",
  "telnet_port": "TELNET_SERVER_PORT",
  "telnet_timeout": 15000,
  "telnet_username": "",
  "telnet_password": ""
}
``` 

2.  Replace the values of each key with the specific information for your Discord bot and game server.

## Getting Started

To start the bot, run the following command:

bashCopy code

`node index.js` 

The bot will automatically connect to Discord using the token provided in the `config.json` file and start fetching server information and displaying it on the Discord server.

## Usage

The zBot will automatically update the categories specified in the `config.json` file with the server information every 15 seconds.

## Features

-   Displays the server status (online/offline) in a designated channel.
-   Updates the server time display in a specified category.
-   Calculates and displays the time remaining before the next Blood Moon in a separate category.

## Help and Support

If you encounter any issues during the installation or use of the bot, feel free to open an issue on the bot's GitLab repository: [Link to GitLab Repository](https://gitlab.com/your-username/zBot).

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

**Dependencies versions:**

-   discord.js: "^12.5.3"
-   telnet-client: "^2.0.8"