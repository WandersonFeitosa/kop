import Canvas from "canvas";
import { AttachmentBuilder } from "discord.js";
import { getUsernameById } from "../utils/getUsernameById";

// Preenche a citação quebrando linhas caso necessário
function fillQuoteText(
  ctx: any,
  text: string,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let currentLine = "";
  let lines = [];

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  lines.push(currentLine);

  const yOffset = (ctx.canvas.height - lines.length * lineHeight) / 2;

  for (let i = 0; i < lines.length; i++) {
    const y = yOffset + i * lineHeight;
    ctx.fillText(lines[i], ctx.canvas.width / 2, y);
  }
}

export async function Citacao(interaction: any) {
  const sentence = interaction.options.getString("frase");
  const authorID = interaction.options.getString("autor");
  let authorName;
  let userAvatar;

  // Verifica se a citação tem um autor
  if (!authorID) {
    authorName = "Anônimo";
  } else if (authorID.includes("<@")) {
    authorName = authorID.replace(/[<@!>]/g, "");

    authorName = await getUsernameById(authorName);
  } else {
    authorName = authorID;
  }

  // Verifica se a citação tem uma frase
  if (!sentence) {
    interaction.reply("Você deve inserir uma frase para a citação");
    return;
  }

  // Gera a data atual
  const date = new Date();
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  // Monta a citação
  const quote = `"${sentence}"`;
  const author = `${authorName}, ${formattedDate}`;

  const canvas = Canvas.createCanvas(640, 480);
  const ctx = canvas.getContext("2d");
  const background = await Canvas.loadImage("./src/images/citacao.jpg");

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.font = "50px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  fillQuoteText(ctx, quote, canvas.width - 100, 60);

  ctx.textAlign = "left";
  ctx.font = "40px sans-serif";
  ctx.fillText(author, 50, 400);

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  const image = canvas.toBuffer();
  const attachmentBuilder = new AttachmentBuilder(image);

  await interaction.reply({ files: [attachmentBuilder] });
}
