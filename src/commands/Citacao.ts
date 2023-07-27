import Canvas from "canvas";
import { AttachmentBuilder } from "discord.js";
import { getUsernameById } from "../utils/getUsernameById";

export async function Citacao(interaction: any) {
  const sentece = interaction.options.getString("frase");
  if (!sentece) {
    interaction.reply("Você deve inserir uma frase para a citação");
    return;
  }
  const authorID = interaction.options.getString("autor");
  let authorName;
  if (authorID) {
    if (!authorID.includes("<@")) {
      interaction.reply(
        "Você deve marcar a pessoa que você deseja a foto da citação"
      );
      return;
    }
    const formatedID = authorID.replace(/[<@!>]/g, "");
    authorName = await getUsernameById(formatedID);
  } else {
    authorName = "Anônimo";
  }
  const date = new Date();
  const formatedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const quote = `"${sentece}"`;
  const author = `${authorName}, ${formatedDate}`;

  const canvas = Canvas.createCanvas(640, 480);
  const ctx = canvas.getContext("2d");
  const background = await Canvas.loadImage("./src/images/citacao.jpg");

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.font = "50px sans-serif";
  ctx.fillStyle = "#ffffff";
  let text = quote;
  let lines = [];
  while (text.length > 17) {
    lines.push(text.substring(0, 17));
    text = text.substring(17);
  }
  lines.push(text);
  for (const line of lines) {
    ctx.fillText(line, 50, 70 + lines.indexOf(line) * 50);
  }

  ctx.font = "40px sans-serif";
  ctx.fillText(author, 50, 400);

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  const image = canvas.toBuffer();

  const attachmentBuilder = new AttachmentBuilder(image);

  await interaction.reply({ files: [attachmentBuilder] });
}
