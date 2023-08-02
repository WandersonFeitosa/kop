import mongoose from "mongoose";

const ncsmpArtsTokensSchema = new mongoose.Schema({
  token: String,
  user: String,
  used: Boolean,
  image: String,
});

const ArtsTokens = mongoose.model("ncsmp-arts-tokens", ncsmpArtsTokensSchema);
export class Token {
  async generateToken(interaction: any) {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const userToken = await ArtsTokens.findOne({
      user: interaction.user.id,
      used: false,
    });

    if (userToken) {
      return interaction.reply(
        "Você já possui um token não utilizado, verifique suas mensagens diretas"
      );
    }

    const newToken = new ArtsTokens({
      token: token,
      user: interaction.user.id,
      used: false,
    });

    await newToken.save();

    await interaction.user.send(`Seu novo token é: ${token}`);

    interaction.reply("Token gerado com sucesso!");
  }
  async listTokens(interaction: any) {
    const tokens = await ArtsTokens.find({ user: interaction.user.id });

    let message = "Seus tokens: \n";

    tokens.forEach((token) => {
      const used = token.used ? "Sim" : "Não";
      const image = token.image ? token.image : "Não utilizado";
      const tokenMsg =
        "```Token: " +
        token.token +
        "\n\nUsado: " +
        used +
        "\n\nImagem: " +
        image +
        "```\n";
      message += tokenMsg;
    });

    interaction.user.send(message);
    interaction.reply("Tokens enviados");
  }
}
