import { client } from '..';
import { aquiles_role_id, player_role_id } from './rolesId';

interface CheckUserRolesProps {
  roleId: string;
  userId: string;
}

export function giveMeberRole({ userId, roleId }: CheckUserRolesProps) {
  const server_id = process.env.SERVER_ID as string;
  const guild = client.guilds.cache.get(server_id);

  const user = guild?.members.cache.get(userId);

  user?.roles.add(roleId);
}
