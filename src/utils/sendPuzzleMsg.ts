import { client } from '..';

export function sendPuzzleMsg(message: string) {
  if (message == 'ENIGMA 4 RESOLVIDO') {
    const announceChannel: any = client.channels.cache.get(
      '1119004778589069312',
    );
    const channel: any = client.channels.cache.get('1119004778589069312');
    announceChannel.send('@everyone');
    announceChannel.send({
      files: ['./src/images/wait.png'],
    });
    channel.send(message + '\n\n @everyone');
    return;
  }
  if (message == 'ENVIAR IMAGEM') {
    const announceChannel: any = client.channels.cache.get(
      '1107698677960687626',
    );
    announceChannel.send({
      content: '|| @everyone https://discord.gg/QfstDap2 ||',
      files: ['./src/images/descarte.png'],
    });
    return;
  }
  const channel: any = client.channels.cache.get('1119004778589069312');
  if (channel) {
    channel.send(message + '\n\n @everyone');
  }
}
