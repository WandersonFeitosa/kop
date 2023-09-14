import axios from "axios";
const serverManagerUrl = process.env.SERVER_MANAGER_URL as string;
const serverManagerToken = process.env.SERVER_MANAGER_TOKEN as string;
import * as fs from 'fs';
import { userHasRole } from "../utils/userHasRole";
import { suport_role_id } from "../utils/rolesId";


export class Logs {
    async getLog(interaction: any) {
        const allowedUser = userHasRole({ userId: interaction.user.id, roleId: suport_role_id });

        if (!allowedUser) {
            return interaction.reply("Você não tem permissão para executar esse comando");
        }
        const requestedFile = interaction.options.getString("nome");
        var config = {
            method: "GET",
            url: serverManagerUrl + "/getLog/" + requestedFile,
            headers: {
                authorization: "Basic " + serverManagerToken,
            }
        };
        async function requestFile() {
            try {
                const response = await axios(config);
                return { data: response.data, sucess: true };
            } catch (err) {
                return { err, sucess: false };
            }
        }

        const response = await requestFile();

        if (response.err) {
            const error: any = response.err;
            return interaction.reply(error.response.data.message);
        }

        const file = response.data

        const fileName = requestedFile;
        await fs.promises.writeFile(`./src/uploads/${fileName}`, file);

        await interaction.reply({
            files: [{
                attachment: `./src/uploads/${fileName}`,
                name: fileName
            }]
        });


        fs.unlink(`./src/uploads/${fileName}`, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })

    }
    async getLogsNames(interaction: any) {
        var config = {
            method: "GET",
            url: serverManagerUrl + "/getLogsNames/",
            headers: {
                authorization: "Basic " + serverManagerToken,
            }
        };
        async function requestFileNames() {
            try {
                const response = await axios(config);
                return { data: response.data, sucess: true };
            } catch (err) {
                return { err, sucess: false };
            }
        }

        const response = await requestFileNames();

        if (response.err) {
            const error: any = response.err;
            return interaction.reply(error.response.data.message);
        }

        const fileNames = response.data.fileNames;

        let table = "Logs\n\n";
        for (let i = 0; i < fileNames.length; i += 4) {
            const row = fileNames
                .slice(i, i + 4)
                .map((item: any, index: any) => `${index === 0 ? "" : "|"} ${item}`)
                .join(" ");
            table += `${row}\n`;
        }
        interaction.reply(`\`\`\`\n${table}\n\`\`\``);

    }
}