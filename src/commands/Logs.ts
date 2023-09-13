import axios from "axios";
const serverManagerUrl = process.env.SERVER_MANAGER_URL as string;
const serverManagerToken = process.env.SERVER_MANAGER_TOKEN as string;

export class Logs {
    async getLog(interaction: any) {
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

        console.log(response)
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