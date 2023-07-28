export const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "roll",
    description: "Rola um d20",
  },
  {
    name: "ana",
    description: "ana",
  },
  {
    name: "momento",
    description: "Te lembra de algo aleatório com base em porra nenhuma",
    options: [
      {
        name: "nome",
        description:
          "Caso queira visualizar uma imagem específica insira o nome dela",
        type: 3,
      },
    ],
  },
  {
    name: "citacao",
    description: "Crie uma citação",
    options: [
      {
        name: "frase",
        description: "Digita aqui a frase da citação",
        type: 3,
      },
      {
        name: "autor",
        description: "Marque a pessoa que você deseja a foto da citação",
        type: 3,
      },
      {
        name: "momento",
        description:
          "Caso queira um momento de background específico insira o nome dele",
        type: 3,
      },
    ],
  },
  {
    name: "listar",
    description: "Lista algo",
    options: [
      {
        name: "momentos",
        description: "Lista todos os momentos",
        type: 1,
      },
    ],
  },
  {
    name: "tempo",
    description: "De diz o tempo restante até o fim do timer na página",
  },
  {
    name: "skins",
    description: "Envia o mod para as skins do Tlauncher",
  },
  {
    name: "plugins",
    description: "Lista todos os plugins instalados no servidor",
    options: [
      {
        name: "page",
        description: "Insira a página que deseja visualizar",
        type: 3,
      },
    ],
  },
  {
    name: "pegarid",
    description: "Pega a id de um jogador",
    options: [
      {
        name: "player",
        description: "Insira a página que deseja visualizar",
        required: false,
        type: 6,
      },
    ],
  },
  {
    name: "familia",
    description: "familia",
    options: [
      {
        name: "listar",
        description: "Lista todos os membros da familia",
        type: 1,
      },
    ],
  },
];
