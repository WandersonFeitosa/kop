export const commands = [
  {
    name: 'ping',
    description: 'Pong',
  },
  {
    name: 'meajudapeloamordedeus',
    description: 'Chama o corno sofredor pra te ajudar',
  },
  {
    name: 'roll',
    description: 'Da uma rolada',
    options: [
      {
        name: 'afortunada',
        description: 'Dá uma rolada afortunada',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'ana',
    description: 'ana',
  },
  {
    name: 'momento',
    description: 'Te lembra de algo aleatório com base em porra nenhuma',
    options: [
      {
        name: 'nome',
        description:
          'Caso queira visualizar uma imagem específica insira o nome dela',
        type: 3,
      },
    ],
  },
  {
    name: 'citacao',
    description: 'Crie uma citação',
    options: [
      {
        name: 'frase',
        description: 'Digita aqui a frase da citação',
        type: 3,
      },
      {
        name: 'autor',
        description: 'Marque a pessoa que você deseja a foto da citação',
        type: 3,
      },
      {
        name: 'momento',
        description:
          'Caso queira um momento de background específico insira o nome dele',
        type: 3,
      },
    ],
  },
  {
    name: 'listar',
    description: 'Lista algo',
    options: [
      {
        name: 'momentos',
        description: 'Lista todos os momentos',
        type: 1,
      },
      {
        name: 'tokens',
        description: 'Lista todos os seus tokens',
        type: 1,
      },
    ],
  },
  {
    name: 'skins',
    description: 'Tutorial de como ver as skins no servidor',
  },
  {
    name: 'plugins',
    description: 'Lista todos os plugins instalados no servidor',
    options: [
      {
        name: 'page',
        description: 'Insira a página que deseja visualizar',
        type: 3,
      },
    ],
  },
  {
    name: 'pegarinfo',
    description: 'Busque informações de um usuário',
    options: [
      {
        name: 'foto',
        description: 'Busca a foto de um usuário',
        required: false,
        type: 1,
        options: [
          {
            name: 'usuario',
            description: 'Insira o nome do usuário',
            type: 6,
            required: true,
          },
        ],
      },
      {
        name: 'id',
        description: 'Busca a foto de um usuário',
        required: false,
        type: 1,
        options: [
          {
            name: 'usuario',
            description: 'Insira o nome do usuário',
            type: 6,
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: 'familia',
    description: 'familia',
    options: [
      {
        name: 'listar',
        description: 'Lista todos os membros da familia',
        type: 1,
      },
    ],
  },
  {
    name: 'comandos',
    description: 'Lista todos os comandos disponíveis',
  },
  {
    name: 'token',
    description:
      'Gera um token para postar artes na página de artes do servidor',
  },
  {
    name: 'backup',
    description: 'Inicia um backup do servidor',
  },
  {
    name: 'logs',
    description: 'Busca um log do servidor',
    options: [
      {
        name: 'nome',
        description: 'Para receber um log insira o nome dele',
        type: 3,
      },
    ],
  },
  {
    name: 'apoiador',
    description:
      'Pague um lanche para a Ana e se torne um apoiador do servidor',
    options: [
      {
        name: 'coxinha',
        description: 'Apoie a Ana com uma coxinha R$ 2,50',
        type: 1,
      },
      {
        name: 'salgado',
        description: 'Apoie a Ana com um salgado R$ 5,00',
        type: 1,
      },
      {
        name: 'bolo',
        description: 'Apoie a Ana com um bolo R$ 10,00',
        type: 1,
      },
      {
        name: 'validar',
        description: 'Validar se seu pagamento foi efetuado',
        type: 1,
      },
      {
        name: 'limpar',
        description: 'Limpar pagamentos pendentes',
        type: 1,
      },
    ],
  },
  {
    name: 'owlbear',
    description: 'owlbear',
  },
  {
    name: 'campo',
    description: 'Campo anômalo',
  },
  {
    name: 'listar-campo',
    description: 'Lista todos os poderes do campo',
  },
  {
    name: 'limpar-campo',
    description: 'Limpa todos os poderes do campo',
  },
  {
    name: 'iniciativa',
    description: 'Controle de iniciativas',
    options: [
      {
        name: 'inserir',
        description: 'Insira um jogador na iniciativa',
        type: 1,
        options: [
          {
            name: 'nome',
            description: 'Insira os jogadores',
            type: 3,
            required: true,
          },
          {
            name: 'iniciativa',
            description: 'Insira a iniciativa do jogador',
            type: 4,
            required: true,
          },
        ],
      },
      {
        name: 'listar',
        description: 'Lista os jogadores na iniciativa',
        type: 1,
      },
      {
        name: 'limpar',
        description: 'Limpa a iniciativa',
        type: 1,
      },
      {
        name: 'remover',
        description: 'Remove um jogador da iniciativa',
        type: 1,
        options: [
          {
            name: 'nome',
            description: 'Insira o nome do jogador',
            type: 3,
            required: true,
          },
        ],
      },
    ],
  },
];
