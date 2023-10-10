import axios from 'axios';
const serverManagerUrl = process.env.SERVER_MANAGER_URL as string;
const serverManagerToken = process.env.SERVER_MANAGER_TOKEN as string;
import * as fs from 'fs';
import { userHasRole } from '../utils/userHasRole';
import { suport_role_id } from '../utils/rolesId';
import { client } from '..';
import http from 'http';

export class Logs {
  async getLog(interaction: any) {
    const allowedUser = userHasRole({
      userId: interaction.user.id,
      roleId: suport_role_id,
    });

    if (!allowedUser) {
      return interaction.reply(
        'Você não tem permissão para executar esse comando',
      );
    }
    const requestedFile = interaction.options.getString('nome');
    const config = {
      url: serverManagerUrl + '/getLog/' + requestedFile,
    };
    const options = {
      headers: {
        Authorization: `Bearer ${serverManagerToken}`,
      },
    };

    try {
      http.get(config.url, options, (res) => {
        const buffers: Buffer[] = [];
        res.on('data', async (chunk) => {
          buffers.push(chunk);
        });
        res.on('end', async () => {
          const completeBuffer = Buffer.concat(buffers);

          await fs.promises.writeFile(
            `./src/uploads/${requestedFile}`,
            completeBuffer,
          );

          await interaction.reply({
            files: [
              {
                attachment: `./src/uploads/${requestedFile}`,
                name: requestedFile,
              },
            ],
          });

          fs.unlink(`./src/uploads/${requestedFile}`, (err) => {
            if (err) {
              console.error(err);
              new Error('Erro ao deletar o arquivo');
              return;
            }
          });
        });
      });
    } catch (err) {
      interaction.reply('Erro ao buscar o arquivo, tente novamente mais tarde');
    }
  }
  async getLogsNames(interaction: any) {
    const allowedUser = userHasRole({
      userId: interaction.user.id,
      roleId: suport_role_id,
    });

    if (!allowedUser) {
      return interaction.reply(
        'Você não tem permissão para executar esse comando',
      );
    }

    var config = {
      method: 'GET',
      url: serverManagerUrl + '/getLogsNames/',
      headers: {
        authorization: 'Basic ' + serverManagerToken,
      },
    };
    async function requestFileNames() {
      try {
        const response = await axios(config);
        return { data: response.data, sucess: true };
      } catch (err) {
        return { err, sucess: false };
      }
    }
    try {
      const response = await requestFileNames();

      if (response.err) {
        const error: any = response.err;
        return interaction.reply(error.response.data.message);
      }

      const fileNames = response.data.fileNames;
      const channelId = interaction.channel.id;
      const channel: any = client.channels.cache.get(channelId);

      const MAX_CHARACTERS = 1500;
      let table = 'Logs\n\n';
      for (let i = 0; i < fileNames.length; i += 4) {
        const row = fileNames
          .slice(i, i + 4)
          .map((item: any, index: any) => `${index === 0 ? '' : '|'} ${item}`)
          .join(' ');
        if (table.length > MAX_CHARACTERS) {
          channel.send(`\`\`\`\n${table}\n\`\`\``);
          table = '';
        }
        table += `${row}\n`;
      }
      interaction.reply('Logs');
      return channel.send(`\`\`\`\n${table}\n\`\`\``);
    } catch (err) {
      interaction.reply('Erro ao buscar o arquivo, tente novamente mais tarde');
    }
  }
}
