export function Roll(interaction: any) {
  const rolada = String(Math.floor(Math.random() * 20));

  interaction.reply(`Sua rolada deu ${rolada}`); 
}
