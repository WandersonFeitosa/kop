import { getFileNamesInFolder } from "../utils/getFileNamesInFolder";

export class Momento {
  async momento(interaction: any) {
    const requestedFile = interaction.options.getString("nome");
    const folderPath = "./src/images/momentos/";
    const fileNames: any = await getFileNamesInFolder(folderPath);
    const randomFileName =
      fileNames[Math.floor(Math.random() * fileNames.length)];

    if (requestedFile) {
      const requestedFileName = fileNames.find(
        (fileName: any) => fileName.split(".")[0] === requestedFile
      );
      if (!requestedFileName) {
        interaction.reply("Momento não encontrado");
        return;
      }
      interaction.reply({
        files: [`./src/images/momentos/${requestedFileName}`],
      });
      return;
    }

    interaction.reply({
      files: [`./src/images/momentos/${randomFileName}`],
    });
  }

  async listMomentos(interaction: any) {
    const folderPath = "./src/images/momentos/";
    const fileNames: any = await getFileNamesInFolder(folderPath);
    const list = fileNames.map((fileName: any) => fileName.split(".")[0]);
    let table = "Momentos\n\n";
    for (let i = 0; i < list.length; i += 5) {
      const row = list
        .slice(i, i + 5)
        .map((item: any, index: any) => `${index === 0 ? "" : "|"} ${item}`)
        .join(" ");
      table += `${row}\n`;
    }
    interaction.reply(`\`\`\`\n${table}\n\`\`\``);
  }
}
