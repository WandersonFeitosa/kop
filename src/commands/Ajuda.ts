import { commands } from "./CommandList";

export class Help {
  async help(interaction: any) {
    let comandos = "";
    commands.forEach((command) => {
      comandos += `/${command.name} - ${command.description}\n\n`;
    });

    await interaction.reply(comandos);
  }
  async vando(interaction: any) {
    interaction.reply("<@339177530772815875> me ajuda pelo amor de deus");
  }
}
