"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugins = exports.Ncsmplugins = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pluginsSchema = new mongoose_1.default.Schema({
    name: String,
    description: String,
});
exports.Ncsmplugins = mongoose_1.default.model("ncsmplugins", pluginsSchema);
let plugins = [];
async function getPlugins() {
    plugins = await exports.Ncsmplugins.find();
    return;
}
getPlugins();
class Plugins {
    async listPlugins(interaction, page) {
        const MAX_CHARACTERS = 2000;
        const perPage = 8;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const remainingPlugins = plugins.slice(startIndex, endIndex);
        let pluginList = remainingPlugins.reduce((accumulator, plugin) => {
            const pluginText = `\n**${plugin.name}** - ${plugin.description}\n`;
            if (accumulator.length + pluginText.length <= MAX_CHARACTERS) {
                accumulator += pluginText;
            }
            else {
                return accumulator;
            }
            return accumulator;
        }, "");
        if (endIndex < plugins.length) {
            pluginList += `\n*Exibindo página ${page}/${Math.ceil(plugins.length / perPage)}. Use o comando com o número da página que desja visualizar.*`;
        }
        interaction.reply(pluginList);
    }
}
exports.Plugins = Plugins;
