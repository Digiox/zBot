import { Client, TextChannel } from "discord.js";
import { actual_blood_moon_day_channel, actual_blood_moon_day_channel_prefix } from "../../../config.json"
import log from "../log"
export default async (day: number, client: Client) => {
    if (!actual_blood_moon_day_channel) {
        log("actual_blood_moon_day is not set, the value will not display on the server")
        return;
    }
    try {
        const timeDisplayCategory = await client.channels.fetch(actual_blood_moon_day_channel) as TextChannel;

        timeDisplayCategory.setName(`${actual_blood_moon_day_channel_prefix}${day}`)
            .then(() => {
                log("Actual time updated");
            })
            .catch(() => {
                log("Error updating actual time");
            });
    } catch (error) {
        log(JSON.stringify(error));
    }
}