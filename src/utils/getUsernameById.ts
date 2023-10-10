import { client } from '..';

export const getUsernameById = async (userId: any) => {
  const user = await client.users.fetch(userId);
  return user.username;
};
