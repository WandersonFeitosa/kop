"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const discord_js_2 = require("discord.js");
const Ana_1 = require("./commands/Ana");
const Roll_1 = require("./commands/Roll");
const Plugins_1 = require("./commands/Plugins");
const client = new discord_js_2.Client({ intents: [discord_js_2.GatewayIntentBits.Guilds] });
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const dbUrl = process.env.MONGODB_URI || "";
const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
    {
        name: "roll",
        description: "Rola um d20",
    },
    {
        name: "ana",
        description: "ana",
    },
    {
        name: "plugins",
        description: "Lista todos os plugins instalados no servidor",
        options: [
            {
                name: "page",
                description: "Insira a página que deseja visualizar",
                type: 3,
            },
        ],
    },
];
const rest = new discord_js_1.REST({ version: "10" }).setToken(TOKEN);
async function startServer() {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(discord_js_1.Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log("Successfully reloaded application (/) commands.");
        client.login(TOKEN);
    }
    catch (error) {
        console.error(error);
    }
}
mongoose_1.default
    .connect(dbUrl)
    .then(() => {
    console.log("Conectado ao banco de dados");
    startServer();
})
    .catch((err) => {
    console.log(err);
});
client.on("ready", () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
});
client.on("interactionCreate", async (interaction) => {
    var _a;
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
    if (interaction.commandName === "ana") {
        (0, Ana_1.Ana)(interaction);
    }
    if (interaction.commandName === "roll") {
        (0, Roll_1.Roll)(interaction);
    }
    if (interaction.commandName === "plugins") {
        const page = ((_a = interaction.options.get("page")) === null || _a === void 0 ? void 0 : _a.value) || 1;
        new Plugins_1.Plugins().listPlugins(interaction, page);
    }
});
