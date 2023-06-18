export function Roll(interaction: any) {
  const rolada = String(Math.floor(Math.random() * 100));

  if (rolada === "0") {
    interaction.reply(
      `Sua rolada deu ${rolada}! Você ganhou um grandiozíssimo graveto!`
    );
    return;
  }
  if (rolada >= "1" && rolada <= "49") {
    interaction.reply(
      `Sua rolada deu ${rolada}! Você ganhou uma vara de blaze!`
    );
    return;
  }
  if (rolada >= "50" && rolada <= "99") {
    interaction.reply(
      `Sua rolada deu ${rolada}! Você ganhou uma maçã dourada!`
    );
    return;
  }
  if (rolada === "100") {
    interaction.reply(
      `Sua rolada deu ${rolada}! Você ganhou um peitoral de netherite!`
    );
    return;
  }
}
