export class getInfo {
  async returnUserID(interaction: any) {
    const userID = interaction.options.getUser('usuario');
    if (!userID) return interaction.reply('Usuário não encontrado');
    interaction.reply(`O id do usuário é ${userID.id}`);
  }
  async returnUserPhoto(interaction: any) {
    const userID = interaction.options.getUser('usuario');
    if (!userID) return interaction.reply('Usuário não encontrado');
    const userPhoto = userID.displayAvatarURL({ format: 'png', size: 2048 });
    interaction.reply(userPhoto);
  }
}
