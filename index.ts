import { Client, IntentsBitField, TextChannel } from 'discord.js';
import { token, game_server_address, game_server_port } from './config.json';
import { pingIP } from './src/functions/checkStatus';
import telnetClient from "./src/telnetSocket"
import log from './src/functions/log';
import updateStatus from './src/functions/automated/updateStatus';
import setRemainingTimeBeforeBloodMoon from './src/functions/automated/setRemainingTimeBeforeBloodMoon.js';
import setActualTime from './src/functions/automated/setActualTime';
import minutesToDays from './src/functions/minutesToDays';

const client = new Client({ intents: [IntentsBitField.Flags.Guilds] });
let lastStatus: boolean | null = null;
let lastRemainingTime: number | null = null;
let lastTimeResult: string | null = null;


async function updateCategoryName() {
  try {
    const { getActualTime, getBloodMoonFrequency, closeSocket, getDayNightLengthTime } = await telnetClient();

    const timeResult = await getActualTime();
    const bloodMoonFrequency = await getBloodMoonFrequency();
    const dayNightLength = await getDayNightLengthTime();
    await closeSocket();

    const dayMatch = timeResult.match(/Day (\d+)/);
    const hourMatch = timeResult.match(/(\d+):(\d+)/);

    if (!dayMatch || !hourMatch) {
      log(`Unable to extract day and hour from timeResult: ${timeResult}`);
      return;
    }

    const currentDay = parseInt(dayMatch[1]);
    const currentHour = parseInt(hourMatch[1]);
    const currentMinutes = parseInt(hourMatch[2]);

    const getNextBloodMoonDay = (actual: number, frequency: number) => {
      while (actual % frequency !== 0) {
        actual++;
      }
      return actual;
    };

    let nextBloodMoonDay = getNextBloodMoonDay(currentDay, bloodMoonFrequency);

    const checkIfShouldTakeNextBloodMoonDay = (actualDay: number, nextBloodMoonDay: number, actualHour: number, actualMinutes: number, frequency: number) => {
      if (actualDay === nextBloodMoonDay && actualHour >= 22 && actualMinutes > 0) {
        return actualDay + frequency;
      }
      return nextBloodMoonDay;
    };

    nextBloodMoonDay = checkIfShouldTakeNextBloodMoonDay(currentDay, nextBloodMoonDay, currentHour, currentMinutes, bloodMoonFrequency);

    const getDaysLeft = (currentDay: number, currentHour: number, currentMinutes: number, nextBloodMoonDay: number) => {
      let dLeft = nextBloodMoonDay - currentDay;
      if (currentHour > 22 && currentMinutes > 0) {
        dLeft = dLeft - 1;
      }
      return dLeft;
    };

    const dLeft = getDaysLeft(currentDay, currentHour, currentMinutes, nextBloodMoonDay);

    const minutes = dLeft * dayNightLength;
    const days = minutesToDays(minutes);

    // Implement actions on discord server here

    if (lastRemainingTime !== days) {
      lastRemainingTime = days
      await setRemainingTimeBeforeBloodMoon(client, days)
      
    } else {
      log("Remaining time has not been changed");
    }

    if (lastTimeResult !== timeResult) {
      lastTimeResult = timeResult
      await setActualTime(client, timeResult)
      
    } else {
      log("actual time has not been changed");
    }


  } catch (error) {
    log(`Telnet error: ${error}`);

    if (error === "Error: Cannot connect") {

      if (lastStatus !== false) {
        lastStatus = false;
      }
    }
  }
}

client.rest.on("rateLimited", (e) => console.error(e));

client.once("ready", () => {
  log(`Ready! Logged in as ${client.user?.tag}`);

  // Update the category name every 5 seconds
  setInterval(updateCategoryName, 300000);

  // Function to check the server status and send messages if it changes
  function checkServerStatus() {
    const ip = game_server_address;
    const port = game_server_port;

    pingIP(ip, parseInt(port), (err: Error | null, success: boolean) => {
      if (err) {
        log(`Ping failed: ${err.message}`);
        if (lastStatus !== false) {
          lastStatus = false;
          updateStatus(client, lastStatus);
        }
      } else {
        log('Ping successful!');
        if (lastStatus !== true) {
          lastStatus = true;
          updateStatus(client, lastStatus);
        }
      }
    });
  }

  // Check the server status every 10 seconds
  setInterval(checkServerStatus, 10000);
});

// Log in to Discord with your client's token
client.login(token);
