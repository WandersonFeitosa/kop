const tutorial = `
**PLUGIN DE SKIN**
Passo a Passo para colocarem as skins:

Um detalhe muito importante, idenpendente do Launcher que você utilize, caso ele tenha um sistema de skins próprio, como o Tlauncher, desative ele. 

Caso não saiba como, basta pedir ajuda no #•⚙┋problemas , que alguém vai te dar uma ajudinha.

***Passo 1:***
> Mande a skin baixada para si mesmo(a) no Discord ou para alguém.

***Passo 2:***
> Copie o Url da sua skin.

***Passo 3:***
Adicione o seguinte comando já no Minecraft:
/Skin url (Link da foto da skin)

***Ex:***
/Skin url ||https://cdn.discordapp.com/attachments/736285548825542738/1129499977622749184/2023_06_24_cellbit-with-explosion-scars-after-the-qsmp-debate-21724865.png|| (É uma skin aleatória que colocamos)

***Obs:***  Toda a vez que quiserem mudar de skin é necessário fazer esse passo a passo!

Isso é necessário apenas para que os demais consigam ver suas skins usando o plugin.

==================================================
`;

export class Skins {
  async sendTutorial(interaction: any) {
    interaction.reply(tutorial);
  }
}
