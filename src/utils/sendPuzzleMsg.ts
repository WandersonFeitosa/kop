import { client } from "..";

export function sendPuzzleMsg(message: string) {
  if (message == "ENIGMA 4 RESOLVIDO") {
    const announceChannel: any = client.channels.cache.get(
      "1119004778589069312"
    );
    const channel: any = client.channels.cache.get("1119004778589069312");
    announceChannel.send("@everyone");
    announceChannel.send({
      files: ["./src/images/wait.png"],
    });
    channel.send(message + "\n\n @everyone");
    return;
  }
  const channel: any = client.channels.cache.get("1119004778589069312");
  if (channel) {
    channel.send(message + "\n\n @everyone");
  }
}
