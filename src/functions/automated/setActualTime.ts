import { Client, TextChannel } from 'discord.js';
import { actual_time_channel_prefix, time_display_category_id } from "../../../config.json";
import log from "../log";

export default async (client: Client, time: string) => {
  if (!time_display_category_id) {
    log("WARNING: time_display_category_id is not defined, the actual time will not display on your discord server")
    return;
  }
  try {
    const timeDisplayCategory = await client.channels.fetch(time_display_category_id) as TextChannel;

    timeDisplayCategory.setName(`${actual_time_channel_prefix}${time}`)
      .then(() => {
        log("Actual time updated");
      })
      .catch(() => {
        log("Error updating actual time");
      });
  } catch (error) {
    log(JSON.stringify(error));
  }
};
