import { client } from '..';

export async function sendPrivateMessage({
  user_id,
  content,
}: {
  user_id: string;
  content: string;
}) {
  try {
    const user = await client.users.fetch(user_id);
    return user
      .createDM()
      .then((dmChannel) => {
        dmChannel.send(content).catch((err) => {
          console.error('Failed to send private message:', err);
        });
      })
      .catch((err) => {
        console.error('Failed to create DM channel:', err);
      });
  } catch (error) {
    console.error('Failed to send private message:', error);
  }
}
