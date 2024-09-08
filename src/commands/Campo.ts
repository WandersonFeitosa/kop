import {
  CommandInteraction,
  GuildTextBasedChannel,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import mongoose from 'mongoose';

const campoSchema = new mongoose.Schema({
  description: String,
  remainingRounds: Number,
  id: Number,
  pendingNumber: Number,
});

const allowedIds = ['552859738476380170', '339177530772815875'];

export const campo = mongoose.model('campo', campoSchema);

export async function Campo(interaction: CommandInteraction) {
  if (!interaction.isCommand()) return;

  try {
    await interaction.deferReply();

    if (!allowedIds.includes(interaction.user.id))
      return interaction.editReply('Você não é o diego');

    const dice = Math.floor(Math.random() * 10) + 1;
    let dice2 = Math.floor(Math.random() * 10) + 1;

    while (dice === dice2) {
      dice2 = Math.floor(Math.random() * 10) + 1;
    }

    const roundsInfo: {
      rounds: number;
      roundPreReRoll: number;
      rerollMessage?: string | null;
    }[] = [
      {
        rounds: Math.floor(Math.random() * 3) + 1,
        roundPreReRoll: 0,
      },
      {
        rounds: Math.floor(Math.random() * 3) + 1,
        roundPreReRoll: 0,
      },
    ];

    roundsInfo.map((round) => {
      if (round.rounds === 1 && !roundsInfo[0].roundPreReRoll) {
        round.roundPreReRoll = round.rounds;
        round.rounds = Math.floor(Math.random() * 2) + 1;
        round.rerollMessage = `***${round.roundPreReRoll}*** ->`;
      }
    });

    const higherRound = roundsInfo.reduce((acc, round) => {
      if (round.rounds > acc) return round.rounds;
      return acc;
    }, 0);

    const powers = await campo.find();

    await campo.updateMany({ pendingNumber: 0 });

    const powersWithRemainingRounds = powers.filter(
      (power) => power.remainingRounds && power.remainingRounds > 0,
    );

    for (const power of powersWithRemainingRounds) {
      if (!power.remainingRounds) continue;
      await campo.updateOne(
        { id: power.id },
        {
          remainingRounds: power.remainingRounds - 1,
        },
      );
    }

    const power1 = powers.find((power) => power.id === dice);
    const power2 = powers.find((power) => power.id === dice2);

    if (!power1 || !power2) return interaction.editReply('Campo');

    const description = `Dados de rodadadas: ${
      roundsInfo[0].rerollMessage ? roundsInfo[0].rerollMessage : ''
    } **${roundsInfo[0].rounds}** | ${
      roundsInfo[1].rerollMessage ? roundsInfo[1].rerollMessage : ''
    } **${
      roundsInfo[1].rounds
    }** \n\nPor \`${higherRound}\` rodadas \n\n:one: ${
      power1.description
    } \n:two: ${power2.description}`;

    await Promise.all([
      campo.updateOne(
        { id: dice },
        {
          pendingNumber: 1,
        },
      ),
      campo.updateOne(
        { id: dice2 },
        {
          pendingNumber: 2,
        },
      ),
    ]);

    const interactionMessage = await interaction.editReply(description);

    await interactionMessage.react('1️⃣');
    await interactionMessage.react('2️⃣');

    return;
  } catch (error) {
    return interaction.reply('Erro ao executar o comando');
  }
}

export async function RegisterChoice(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
) {
  try {
    if (user.bot || !allowedIds.includes(user.id)) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        return;
      }
    }

    const { message } = reaction;
    const reactionEmoji = reaction.emoji.name;

    if (reactionEmoji !== '1️⃣' && reactionEmoji !== '2️⃣') return;

    const messageContent = message.content;

    if (!messageContent) return;

    const regexArray = messageContent.match(/`([^`]*)`/);

    const rounds = regexArray ? parseInt(regexArray[1]) : 0;

    const powers = await campo.find();

    const power1 = powers.find((power) => power.pendingNumber === 1);
    const power2 = powers.find((power) => power.pendingNumber === 2);

    if (!power1 || !power2) return;

    const chosenPower = reactionEmoji === '1️⃣' ? power1 : power2;

    await campo.updateOne(
      { id: chosenPower.id },
      {
        remainingRounds: rounds,
        pendingNumber: 0,
      },
    );

    await message.reactions.removeAll();

    const powersWithRemainingRounds = await campo.find({
      remainingRounds: { $gt: 0 },
    });

    if (!powersWithRemainingRounds) return;

    const description = powersWithRemainingRounds
      .map((power) => `\`${power.remainingRounds}\` | ${power.description}  `)
      .join('\n');

    await message.edit(description);
  } catch (error) {
    console.log(error);
  }
}

export async function ListRemainingPowers(interaction: CommandInteraction) {
  try {
    if (!interaction.isCommand()) return;
    await interaction.deferReply();

    const powers = await campo.find();

    const powersWithRemainingRounds = powers.filter(
      (power) => power.remainingRounds && power.remainingRounds > 0,
    );

    if (!powersWithRemainingRounds.length)
      return interaction.editReply('Nenhum poder ativo');

    const description = powersWithRemainingRounds
      .map((power) => `\`${power.remainingRounds}\` | ${power.description}  `)
      .join('\n');

    await interaction.editReply(description);
  } catch (error) {
    return interaction.reply('Erro ao executar o comando');
  }
}

export async function ClearPowers(interaction: CommandInteraction) {
  try {
    if (!interaction.isCommand()) return;
    await interaction.deferReply();

    const powers = await campo.find();

    const powersWithRemainingRounds = powers.filter(
      (power) => power.remainingRounds && power.remainingRounds > 0,
    );

    if (!powersWithRemainingRounds.length)
      return interaction.editReply('Nenhum poder ativo');

    await campo.updateMany({ remainingRounds: 0 });

    await interaction.editReply('Poderes limpos');
  } catch (error) {
    return interaction.reply('Erro ao executar o comando');
  }
}
