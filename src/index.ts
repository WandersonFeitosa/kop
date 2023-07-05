import { REST, Routes } from "discord.js";
import "dotenv/config";
import mongoose from "mongoose";

import { Client, GatewayIntentBits } from "discord.js";
import { Ana } from "./commands/Ana";
import { Roll } from "./commands/Roll";
import { Plugins } from "./commands/Plugins";
import { Familia } from "./commands/Familia";
import { commands } from "./commands/CommandList";
import express from "express";
import routes from "./routes/routes";
import { Momento } from "./commands/Momento";
import { getRemainingTime } from "./utils/getRemainingTime";

const app = express();
app.use(express.json());
app.use(routes);

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const dbUrl = process.env.MONGODB_URI || "";

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
  // new Familia().updatePlayerNames();
  // new Familia().updateAquilesNames();
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
  if (interaction.commandName === "pegarid") {
    new Familia().getID(interaction);
  }
  if (interaction.commandName === "familia") {
    if (interaction.options.getSubcommand() === "listar") {
      new Familia().listFamilies(interaction);
    }
  }
  if (interaction.commandName === "momento") {
    new Momento().momento(interaction);
  }
  if (interaction.commandName === "tempo") {
    getRemainingTime(interaction);
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
