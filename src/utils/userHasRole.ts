import { client } from "..";
import { aquiles_role_id, player_role_id } from "./rolesId";

interface CheckUserRolesProps {
  roleId: string;
  userId: string;
}
export function userHasRole({ userId, roleId }: CheckUserRolesProps) {
  const server_id = process.env.SERVER_ID as string;
  const guild = client.guilds.cache.get(server_id);

  const user = guild?.members.cache.get(userId);

  const hasRole = user?.roles.cache.has(roleId) || false;

  return hasRole;
}

export function getUserType(userId: string) {
  let userType = "";

  if (userHasRole({ userId, roleId: aquiles_role_id })) {
    userType = "aquiles";
  } else if (userHasRole({ userId, roleId: player_role_id })) {
    userType = "player";
  }
  return userType;
}