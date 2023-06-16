import { REST, Routes } from "discord.js";
import "dotenv/config";

import { Client, GatewayIntentBits } from "discord.js";
import { Ana } from "./commands/Ana";
import { Roll } from "./commands/Roll";
import { Plugins } from "./commands/Plugins";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const prefix = "";

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
  },
  {
    name: "plugins2",
    description: "Lista mais",
  }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

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
  if(interaction.commandName === "plugins") {
    new Plugins().listPlugins(interaction);
  }
  if(interaction.commandName === "plugins2") {
    new Plugins().listPlugins2(interaction);
  }
});

client.on("message", (message) => {
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
});
client.login(TOKEN);
