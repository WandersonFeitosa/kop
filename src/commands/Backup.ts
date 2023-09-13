import axios from "axios";
import { suport_role_id } from "../utils/rolesId";
import { userHasRole } from "../utils/userHasRole";

const backupUrl = process.env.SERVER_BACKUP_URL as string;
const backupToken = process.env.SERVER_BACKUP_TOKEN as string;

export class Backup {
    async startBackup(interaction: any) {

        const allowedUser = userHasRole({ userId: interaction.user.id, roleId: suport_role_id });

        if (!allowedUser) {
            return interaction.reply("Você não tem permissão para executar esse comando");
        }

        var config = {
            method: "GET",
            url: backupUrl,
            headers: {
                authorization: "Basic " + backupToken,
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