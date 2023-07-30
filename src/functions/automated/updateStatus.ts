import { Client, TextBasedChannel } from 'discord.js';
import { server_status_channel_id, server_status_mention_role } from "../../../config.json";
import log from "../log";

export default (client: Client, status: boolean) => {
    const channel = client.channels.cache.get(server_status_channel_id) as TextBasedChannel;

    if (channel && channel.isTextBased()) {
        const message = `Le serveur est ${status ? "en ligne" : "hors ligne"} <@&${server_status_mention_role}>`;
        channel.send(message)
            .then(() => {
                log("Server status sent to discord server");
            })
            .catch(() => log("Error while sending server state to discord server"));

        log(message);
    }
};
