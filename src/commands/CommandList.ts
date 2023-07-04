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
