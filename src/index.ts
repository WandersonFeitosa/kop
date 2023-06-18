import { REST, Routes } from "discord.js";
import "dotenv/config";
import mongoose from "mongoose";

import { Client, GatewayIntentBits } from "discord.js";
import { Ana } from "./commands/Ana";
import { Roll } from "./commands/Roll";
import { Plugins } from "./commands/Plugins";
import { Sorteio } from "./commands/Sorteio";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
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
  {
    name: "sorteio",
    description: "Realiza um sorteio",
  },
  {
    name: "vincular",
    description: "Vincula com uma pessoa do servidor",
  },
  {
    name: "desvincular",
    description: "Remove vinculos",
  },
  {
    name: "pegarid",
    description: "Pega a id de um jogador",
    options: [
      {
        name: "player",
        description: "Insira a página que deseja visualizar",
        required: false,
        type: 6,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function startServer() {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");

    client.login(TOKEN);
  } catch (error) {
    console.error(error);
  }
}
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Conectado ao banco de dados");
    startServer();
  })
  .catch((err) => {
    console.log(err);
  });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction: any) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (interaction.commandName === "ana") {
    Ana(interaction);
  }
  if (interaction.commandName === "roll") {
    Roll(interaction);
  }
  if (interaction.commandName === "plugins") {
    const page = interaction.options.get("page")?.value || 1;
    new Plugins().listPlugins(interaction, page);
  }
  if (interaction.commandName === "sorteio") {
    new Sorteio().raffle(interaction);
  }
  if (interaction.commandName === "vincular") {
    new Sorteio().bindUser(interaction);
  }
  if (interaction.commandName === "desvincular") {
    new Sorteio().unbindUser(interaction);
  }
  if (interaction.commandName === "pegarid") {
    new Sorteio().getID(interaction);
  }
});
