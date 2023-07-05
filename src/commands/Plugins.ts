import mongoose from "mongoose";

const pluginsSchema = new mongoose.Schema({
  name: String,
  description: String,
});

export const Ncsmplugins = mongoose.model("ncsmplugins", pluginsSchema);

let plugins: Array<any> = [];

async function getPlugins() {
  plugins = await Ncsmplugins.find();

  return;
}

getPlugins();

export class Plugins {
  async listPlugins(interaction: any, page: number) {
    const MAX_CHARACTERS = 2000;
    const perPage = 8;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const totalPages = Math.ceil(plugins.length / perPage);

    if (isNaN(page)) {
      interaction.reply(
        `O valor inserido não é um número. Use o comando com o número da página que desja visualizar.`
      );
      return;
    }

    if (page > totalPages) {
      interaction.reply(
        `A página ${page} não existe. Use o comando com o número da página que desja visualizar.`
      );
      return;
    }

    const remainingPlugins = plugins.slice(startIndex, endIndex);

    let pluginList = remainingPlugins.reduce((accumulator, plugin) => {
      const pluginText = `\n**${plugin.name}** - ${plugin.description}\n`;
      if (accumulator.length + pluginText.length <= MAX_CHARACTERS) {
        accumulator += pluginText;
      } else {
        return accumulator;
      }
      return accumulator;
    }, "");

    if (endIndex < plugins.length) {
      pluginList += `\n*Exibindo página ${page}/${totalPages}. Use o comando com o número da página que desja visualizar.*`;
    }

    interaction.reply(pluginList);
  }
}
