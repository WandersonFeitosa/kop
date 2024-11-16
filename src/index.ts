import {
  Client,
  GatewayIntentBits,
  Events,
  Partials,
  REST,
  Routes,
} from 'discord.js';
import 'dotenv/config';
import mongoose from 'mongoose';

import { Ana } from './commands/Ana';
import { Roll } from './commands/Roll';
import { Plugins } from './commands/Plugins';
import { Familia } from './commands/Familia';
import { commands } from './commands/CommandList';
import express from 'express';
import routes from './routes/routes';
import { Momento } from './commands/Momento';
import { getInfo } from './commands/PegarInfo';
import { Skins } from './commands/Skins';
import { Quote } from './commands/Citacao';
import { Help } from './commands/Ajuda';
import { Token } from './commands/Token';
import { Supporter } from './commands/Apoiador';
import { PaymentsController } from './controllers/PaymentsController';
import { Backup } from './commands/Backup';
import { Logs } from './commands/Logs';
import schedule from 'node-schedule';
import { requestBackupStart } from './utils/requestBackupStart';
import { InitiativeController } from './commands/Iniciativa';
import { sendPrivateMessage } from './utils/sendPrivateMessage';
import {
  Campo,
  ClearPowers,
  ListRemainingPowers,
  RegisterChoice,
} from './commands/Campo';
import { Flowise } from './commands/Flowise';

const app = express();
app.use(express.json());
app.use(routes);

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const dbUrl = process.env.MONGODB_URI || '';

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function startServer() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');

    client.login(TOKEN);
  } catch (error) {
    console.error(error);
  }
}

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('Conectado ao banco de dados');
    startServer();
  })
  .catch((err) => {
    console.log(err);
  });

client.on('ready', () => {
  console.log(`Loggedin as ${client.user?.tag}!`);
  client.user?.setPresence({
    activities: [{ name: '/comandos', type: undefined }],
    status: 'online',
  });
});

client.on(Events.MessageCreate, async (message) => {
  if (client.user && message.mentions.has(client.user.id) && !message.author.bot) {
    await new Flowise().messageReply(message);
  }
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    return await interaction.reply('Pong!');
  }
  if (interaction.commandName === 'ana') {
    return Ana(interaction);
  }
  if (interaction.commandName === 'roll') {
    return Roll(interaction);
  }
  if (interaction.commandName === 'plugins') {
    const page = interaction.options.get('page')?.value || 1;
    return new Plugins().listPlugins(interaction, page);
  }
  if (interaction.commandName === 'familia') {
    if (interaction.options.getSubcommand() === 'listar') {
      return new Familia().listFamilies(interaction);
    }
  }
  if (interaction.commandName === 'momento') {
    return new Momento().momento(interaction);
  }
  if (interaction.commandName === 'skins') {
    return new Skins().sendTutorial(interaction);
  }
  if (interaction.commandName === 'listar') {
    if (interaction.options.getSubcommand() === 'momentos') {
      return new Momento().listMomentos(interaction);
    }
    if (interaction.options.getSubcommand() === 'tokens') {
      return new Token().listTokens(interaction);
    }
  }
  if (interaction.commandName === 'citacao') {
    return new Quote().quote(interaction);
  }
  if (interaction.commandName === 'pegarinfo') {
    if (interaction.options.getSubcommand() === 'foto') {
      return new getInfo().returnUserPhoto(interaction);
    }
    if (interaction.options.getSubcommand() === 'id') {
      return new getInfo().returnUserID(interaction);
    }
  }
  if (interaction.commandName === 'comandos') {
    return new Help().help(interaction);
  }
  if (interaction.commandName === 'meajudapeloamordedeus') {
    return new Help().vando(interaction);
  }
  if (interaction.commandName === 'token') {
    return new Token().generateToken(interaction);
  }
  if (interaction.commandName === 'apoiador') {
    if (interaction.options.getSubcommand() === 'validar') {
      return new PaymentsController().validatePayment(interaction);
    } else if (interaction.options.getSubcommand() === 'limpar') {
      return new PaymentsController().clearPayment(interaction);
    } else {
      return new Supporter().generatePayment(interaction);
    }
  }
  if (interaction.commandName == 'backup') {
    return new Backup().startBackup(interaction);
  }
  if (interaction.commandName == 'logs') {
    const fileName = interaction.options.getString('nome');
    if (fileName) {
      return new Logs().getLog(interaction);
    } else {
      return new Logs().getLogsNames(interaction);
    }
  }
  if (interaction.commandName == 'campo') {
    return await Campo(interaction);
  }
  if (interaction.commandName == 'listar-campo') {
    return await ListRemainingPowers(interaction);
  }
  if (interaction.commandName == 'limpar-campo') {
    return await ClearPowers(interaction);
  }
  if (interaction.commandName === 'iniciativa') {
    if (interaction.options.getSubcommand() === 'inserir') {
      return new InitiativeController().addPlayer(interaction);
    }
    if (interaction.options.getSubcommand() === 'listar') {
      return new InitiativeController().listPlayers(interaction);
    }
    if (interaction.options.getSubcommand() === 'limpar') {
      return new InitiativeController().clearPlayers(interaction);
    }
    if (interaction.options.getSubcommand() === 'remover') {
      return new InitiativeController().removeSinglePlayer(interaction);
    }
  }
  if (interaction.commandName === 'owlbear') {
    return await interaction.reply(
      'https://www.owlbear.rodeo/room/CtdJ0VFSSOQt/TheDarkBrawl',
    );
  }
  return await interaction.reply('Calma aí paizão, comando não encontrado');
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  await RegisterChoice(reaction, user);
});
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

schedule.scheduleJob('0 7 * * *', async () => {
  try {
    await requestBackupStart();
  } catch (err) {
    console.log(err);
  }
});
