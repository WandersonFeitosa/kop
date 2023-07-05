export async function getRemainingTime(interaction: any) {
  const date = new Date("2023-07-05 18:00:00");

  const endDate = date.getTime();

  const timeRemaining = endDate - new Date().getTime();

  if (timeRemaining > 0) {
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    interaction.reply(
      "Faltam " +
        hours +
        " horas, " +
        minutes +
        " minutos e " +
        seconds +
        " segundos para o fim do timer."
    );
  } else {
    console.log("cabo o timer");
  }
}
