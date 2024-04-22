import mongoose from 'mongoose';

const initiativeSchema = new mongoose.Schema({
  initiative: [
    {
      name: String,
      value: Number,
    },
  ],
  serverId: String,
});

const Initiatives = mongoose.model('initiatives', initiativeSchema);
export class InitiativeController {
  async addPlayer(interaction: any) {
    const player: string = interaction.options.getString('nome');
    const initiative: number = interaction.options.getInteger('iniciativa');
    const serverId = interaction.guild.id;

    const initiativeData = await Initiatives.findOne({ serverId: serverId });

    if (!initiativeData) {
      const newInitiative = new Initiatives({
        initiative: [{ name: player, value: initiative }],
        serverId: serverId,
      });

      await newInitiative.save();
      return interaction.reply('Jogador inserido com sucesso!');
    }

    const playerExists = initiativeData.initiative.find(
      (playerData: any) => playerData.name === player,
    );

    if (playerExists) {
      return interaction.reply(`${player} já está na iniciativa`);
    }

    initiativeData.initiative.push({ name: player, value: initiative });

    await initiativeData.save();

    return interaction.reply(
      `${player} inserido na iniciativa com o valor ${initiative}`,
    );
  }

  async listPlayers(interaction: any) {
    const serverId = interaction.guild.id;

    const initiativeData = await Initiatives.findOne({ serverId: serverId });

    if (!initiativeData) {
      return interaction.reply('Não há jogadores na iniciativa');
    }

    let message = 'Iniciativa: \n';

    initiativeData.initiative.sort((a: any, b: any) => b.value - a.value);

    initiativeData.initiative.forEach((player: any) => {
      message += `\` ${player.value} \` ⟵  ${player.name}\n`;
    });

    interaction.reply(message);

    return;
  }

  async clearPlayers(interaction: any) {
    const serverId = interaction.guild.id;

    const initiativeData = await Initiatives.findOne({ serverId: serverId });

    if (!initiativeData) {
      return interaction.reply('Não há jogadores na iniciativa');
    }

    initiativeData.initiative = [];

    await initiativeData.save();

    return interaction.reply('Iniciativa limpa com sucesso!');
  }

  async removeSinglePlayer(interaction: any) {
    const player: string = interaction.options.getString('nome');
    const serverId = interaction.guild.id;

    const initiativeData = await Initiatives.findOne({ serverId: serverId });

    if (!initiativeData) {
      return interaction.reply('Não há jogadores na iniciativa');
    }

    const playerIndex = initiativeData.initiative.findIndex(
      (playerData: any) => playerData.name === player,
    );

    if (playerIndex === -1) {
      return interaction.reply(`${player} não encontrado na iniciativa`);
    }

    initiativeData.initiative.splice(playerIndex, 1);

    await initiativeData.save();

    return interaction.reply(`${player} foi removido da iniciativa`);
  }
}
