export const commands = [
  {
    name: "ping",
    description: "Pong",
  },
  {
    name: "meajudapeloamordedeus",
    description: "Chama o corno sofredor pra te ajudar",
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
      {
        name: "tokens",
        description: "Lista todos os seus tokens",
        type: 1,
      },
    ],
  },
  {
    name: "skins",
    description: "Tutorial de como ver as skins no servidor",
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
    name: "pegarinfo",
    description: "Busque informações de um usuário",
    options: [
      {
        name: "foto",
        description: "Busca a foto de um usuário",
        required: false,
        type: 1,
        options: [
          {
            name: "usuario",
            description: "Insira o nome do usuário",
            type: 6,
            required: true,
          },
        ],
      },
      {
        name: "id",
        description: "Busca a foto de um usuário",
        required: false,
        type: 1,
        options: [
          {
            name: "usuario",
            description: "Insira o nome do usuário",
            type: 6,
            required: true,
          },
        ],
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
  {
    name: "comandos",
    description: "Lista todos os comandos disponíveis",
  },
  {
    name: "token",
    description:
      "Gera um token para postar artes na página de artes do servidor",
  },
  {
    name: "apoiador",
    description: "Pague uma coxinha pra Ana e se torne um apoiador",
    options: [
      {
        name: "coxinha",
        description: "Apoie a ana com uma coxinha",
        type: 1,
      },
      {
        name: "salgado",
        description: "Apoie a ana com um salgado",
        type: 1,
      },
      {
        name: "bolo",
        description: "Apoie a ana com um bolo",
        type: 1,
      },
      {
        name: "validar",
        description: "Validar se seu pagamento foi efetuado",
        type: 1,
      },
    ],
  },
];
