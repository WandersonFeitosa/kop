export function sendSkin(interaction: any) {
  //Envia um arquivo e uma mensagem
  interaction.reply({
    content:
      "Adicione o arquivo na sua pasta de mods e lembrando que ele pode não funcionar 100%, e é recomendável que use o launcher do Forge",
    files: [`./src/uploads/tl_skin_cape_forge_1.19.3_1.19.4-1.30.jar`],
  });
}
