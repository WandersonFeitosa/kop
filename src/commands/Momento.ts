import fs from "fs";

async function getFileNamesInFolder(folderPath: any) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

export class Momento {
  async momento(interaction: any) {
    const folderPath = "./src/images/momentos/";
    const fileNames: any = await getFileNamesInFolder(folderPath);
    const randomFileName =
      fileNames[Math.floor(Math.random() * fileNames.length)];

    interaction.reply({
      files: [`./src/images/momentos/${randomFileName}`],
    });
  }
}
