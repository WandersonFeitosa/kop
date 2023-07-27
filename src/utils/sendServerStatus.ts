import { client } from "..";

export function sendServerMessage(channelId: string, message: string) {
  const channel: any = client.channels.cache.get(channelId);
  channel.send(message);
  return;
}
