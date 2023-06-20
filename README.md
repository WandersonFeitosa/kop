<h1>Kop</h1>

<p  align="center">
<img  src="http://img.shields.io/static/v1?label=&message=Typescript&color=blue&style=for-the-badge"/>
<img  src="http://img.shields.io/static/v1?label=&message=Node&color=green&style=for-the-badge"/>
<img  src="http://img.shields.io/static/v1?label=&message=MongoDB&color=green&style=for-the-badge"/>
</p>

### Tópicos

:small_blue_diamond: [Descrição do projeto](#descrição-do-projeto)

:small_blue_diamond: [Funções do bot](#funções-do-bot)

:small_blue_diamond: [Tecnologias, plugins e libs](#tecnologias-plugins-e-libs-books)

## Descrição do projeto

<p align="justify">
Um bot de criado para um realizar diversas funções no servidor NCSMP, realacionadas a controle das missões e ser uma ferramenta de uso durante os eventos realizados no servidor
</p>

## Funções do bot

O bot possui algumas funções já implementadas que são utilizadas e outras serão implementadas ao longo do tempo de acordo com disponibilidade e necessidade, sendo essas funções:

- Listagem de plugins
  - [x] Listar todos os plugins com uma breve descrição
  - [ ] Listar detalhadamente cada plugins com um pequeno guia
- Controle de família
  - [x] Sortear a família do jogador
  - [ ] Listar as famílias do servidor
  - [x] Permitir moderadores alterarem família
- Controle de missões de aquiles
  - [ ] Mostrar missões restantes dos aquiles
  - [ ] Relatar conclusão de missão
  - [ ] Validar missão dos aquiles

Os comandos atualmente ativos no servidores são

    /ana - Ana

    /pegarid - Retorna o id do usuário marcado

    /familia sortear - Sorteia a família do usuário

    /familia vincular - Gera um vínculo com um usuário para forçar a mesma família para ambos durante o sorteio

    /familia desvincular - Quebra um vínculo gerado

    /plugins - Retorna a lista de plugins do servidor

    /roll - Realiza um roll de 1 a 100

## Tecnologias, plugins e libs :books:

**Tecnologias JS:**

- Node - 18.x;

Dependências internas do projeto podem ser encontrada na raiz dentro do package.json, e podem ser instaladas através do seguinte comando

```
npm install
```

ou

```
yarn install
```

##

**_Projeto Concluído_**
