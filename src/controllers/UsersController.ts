import { Request, Response } from "express";
import { client } from "..";
import {
  admin_role_id,
  aquiles_role_id,
  player_role_id,
  server_id,
} from "../utils/rolesId";
import { Aquiles } from "../models/Aquiles";
import { Player } from "../models/Player";

interface RegisterUserInDbProps {
  username: string;
  avatar: string;
  isUserAdmin: boolean;
  discordId: string;
  userType: string;
}

async function userExist(userType: string, discordId: string) {
  if (userType === "aquiles") {
    const aquiles = await Aquiles.findOne({ discordId });
    return aquiles;
  }
  if (userType === "player") {
    const player = await Player.findOne({ discordId });
    return player;
  }
  return null;
}



export class UserController {
  async checkAllowedUser(req: Request, res: Response) {
    const { username } = req.params;

    const guild = client.guilds.cache.get(server_id);

    const userQuery = await guild?.members.fetch({ query: username, limit: 1 });

    const userId = userQuery?.first()?.id;

    if (!userId)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const user = guild?.members.cache.get(userId);

    const isUserAquiles = user?.roles.cache.has(aquiles_role_id);

    const isUserPlayer = user?.roles.cache.has(player_role_id);

    const isUserAdmin = user?.roles.cache.has(admin_role_id);

    if (!isUserAquiles && !isUserPlayer) {
      return res.status(401).json({ error: "Usuário não autorizado" });
    }

    res.status(200).json({
      message: "Usuário autorizado",
      userId,
      isUserAdmin,
      isUserAquiles,
      isUserPlayer,
    });
  }
  async registerUserInDb({
    username,
    avatar,
    isUserAdmin,
    discordId,
    userType,
  }: RegisterUserInDbProps) {
    try {
      const existingUser = await userExist(userType, discordId);

      if (existingUser) {
        return existingUser;
      }

      if (userType === "aquiles") {
        const aquiles = new Aquiles({
          username,
          avatar,
          isUserAdmin,
          discordId,
          vip: {
            status: false,
            lastTxid: "",
            lastQrCodeUrl: "",
            lastTxidStatus: "",
          },
          familyInvites: [],
          completedMissions: [],
        });

        await aquiles.save();

        return aquiles;
      } else if (userType === "player") {
        const player = new Player({
          username,
          avatar,
          isUserAdmin,
          discordId,
          vip: {
            status: false,
            lastTxid: "",
            lastQrCodeUrl: "",
            lastTxidStatus: "",
          },
          familyInvites: [],
        });

        await player.save();

        return player;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
