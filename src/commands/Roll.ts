export function Roll(interaction: any) {
  const rolada = String(Math.floor(Math.random() * 100));

  interaction.reply({
    content: `Sua rolada deu ${rolada}`,
  });
}
