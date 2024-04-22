export function Roll(interaction: any) {
  try {
    const string = interaction.options.getString('afortunada');
    if (!string) return interaction.reply('Coloca um valor aí macaco');

    const multiple = string.split('+');

    console.log(multiple);

    const resultGroup: number[][] = [];

    const resultNotReroled: number[][] = [];

    let reroledAmmount = 0;

    multiple.forEach((element: string) => {
      const dice = element.split('d');
      if (dice.length !== 2) {
        resultGroup.push([Number(element)]);
        resultNotReroled.push([Number(element)]);
        return;
      }
      const diceNumber = Number(dice[0]);
      const diceType = Number(dice[1]);
      let result: number[] = [];

      for (let i = 0; i < diceNumber; i++) {
        let random = Math.floor(Math.random() * diceType) + 1;
        result.push(random);
      }
      result = result.sort((a, b) => b - a);

      resultNotReroled.push(result);

      result = result.map((result) => {
        if (result === 1) {
          reroledAmmount++;
          return Math.floor(Math.random() * diceType) + 1;
        }
        return result;
      });

      resultGroup.push(result);
    });

    const resultsAsString = resultGroup.map((result) => {
      if (result.length === 1) return result[0].toString();
      return result.join(', ');
    });

    const notReroledAsString = resultNotReroled.map((result) => {
      if (result.length === 1) return result[0].toString();
      return result.join(', ');
    });

    const response = resultsAsString.join(' + ');

    const sum = resultGroup.reduce((acc, result) => {
      return acc + result.reduce((acc, result) => acc + result, 0);
    }, 0);

    const responseNotReroled = notReroledAsString.join(' + ');

    const sumNotReroled = resultNotReroled.reduce((acc, result) => {
      return acc + result.reduce((acc, result) => acc + result, 0);
    }, 0);

    const difference = sum - sumNotReroled;

    const reply =
      '\n\n' +
      string +
      '\n\n' +
      'Com rerolls: ' +
      `\` ${sum} \`` +
      '  ⟵  ' +
      response +
      '\n\n' +
      'Sem rerolls: ' +
      `\` ${sumNotReroled} \`` +
      '  ⟵  ' +
      responseNotReroled +
      '\n\n' +
      reroledAmmount +
      ' rerolls' +
      '  ⟵  ' +
      difference +
      ' de diferença';

    //verify if the response is bigger than 2000 characters
    if (reply.length > 2000) {
      return interaction.reply(
        '\n\n' +
          'Resultado muito grande, ocultando dados' +
          '\n\n' +
          string +
          '\n\n' +
          'Com rerolls: ' +
          `\` ${sum} \`` +
          '\n\n' +
          'Sem rerolls: ' +
          `\` ${sumNotReroled} \`` +
          '\n\n' +
          reroledAmmount +
          ' rerolls' +
          '  ⟵  ' +
          difference +
          ' de diferença',
      );
    }

    return interaction.reply(reply);
  } catch (error) {
    return interaction.reply('Erro ao executar o comando');
  }
}
