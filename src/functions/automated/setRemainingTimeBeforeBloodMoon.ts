import { TextChannel } from 'discord.js';
import {  time_display_channel_prefix, time_display_channel_suffix, remaining_time_before_BM } from "../../../config.json";
import log from "../log";

export default async (client: any, days: number) => {
  console.log("Is function called");

  try {
    const remainingTimeCategory = await client.channels.fetch(remaining_time_before_BM) as TextChannel;



    const name = time_display_channel_prefix + days + time_display_channel_suffix;

    return await remainingTimeCategory.setName(name)
      .then(() => {
        console.log("Remaining Time category name updated successfully.");
      })
      .catch((err) => {
        log(err);
        log("Error updating Remaining Time category name");
      });
  } catch (error) {
    log(JSON.stringify(error));
  }
};
