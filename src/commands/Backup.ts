import axios from "axios";
import { suport_role_id } from "../utils/rolesId";
import { userHasRole } from "../utils/userHasRole";

const serverManagerUrl = process.env.SERVER_MANAGER_URL as string;
const serverManagerToken = process.env.SERVER_MANAGER_TOKEN as string;

export class Backup {
    async startBackup(interaction: any) {

        const allowedUser = userHasRole({ userId: interaction.user.id, roleId: suport_role_id });

        if (!allowedUser) {
            return interaction.reply("Você não tem permissão para executar esse comando");
        }

        var config = {
            method: "GET",
            url: serverManagerUrl + "/startBackup",
            headers: {
                authorization: "Basic " + serverManagerToken,
            }
        };

        async function requestBackupStart() {
            try {
                const response = await axios(config);
                return { data: response.data, sucess: true };
            } catch (err) {
                return { err, sucess: false };
            }
        }

        const response = await requestBackupStart();

        if (response.err) {
            const error: any = response.err;
            return interaction.reply(error.response.data.message);
        }

        return interaction.reply(response.data.message);
    }
}