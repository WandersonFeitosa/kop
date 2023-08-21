import axios from "axios";

import { getUserType, userHasRole } from "../utils/userHasRole";
import { admin_role_id } from "../utils/rolesId";
import { PaymentsController } from "../controllers/PaymentsController";
import { UserController } from "../controllers/UsersController";

const pixApiUrl = process.env.PIX_API_URL as string;
const pixToken = process.env.PIX_TOKEN as string;

export class Supporter {
  async generatePayment(interaction: any) {
    try {
      //Verifica se o usuário possui algum pagamento pendente
      const pendingPayment = await new PaymentsController().checkPendingPayment(
        interaction.user.id
      );

      if (pendingPayment === "processing") {
        interaction.reply({
          content:
            "Você possuia uma pagamento que precisava de processamento, relize o comando novamente para continuar",
          ephemeral: true,
        });
        return;
      }

      if (pendingPayment) {
        interaction.reply({
          content:
            "Você já realizou um pedido, realize o pagamento no link: " +
            pendingPayment +
            "\nOu limpe seus pagamentos pendentes com o comando /limpar pagamentos",
          ephemeral: true,
        });
        return;
      }
      ////////////

      //Monta a request para a API do PIX de acordo com a solicitação
      const values = {
        coxinha: "2.50",
        salgado: "5.00",
        bolo: "12.00",
      };

      const supportType: "coxinha" | "salgado" | "bolo" =
        interaction.options.getSubcommand();

      const data = {
        name: interaction.user.username,
        cpf: "07103926131",
        value: values[supportType],
      };

      var config = {
        method: "POST",
        url: pixApiUrl + "/payment",
        headers: {
          authorization: "Bearer " + pixToken,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };
      ////////////

      //Realiza o tratamento da resposta da API do PIX
      const response = await axios(config)
        .then(function (response: any) {
          return response.data;
        })
        .catch(function (error: any) {
          console.log(error);
          return null;
        });

      if (!response.txid) {
        interaction.reply({
          content: "Erro ao gerar o pagamento",
          ephemeral: true,
        });
        return;
      }

      const { txid, location } = response;

      const transactionID = location.split("v2/").pop();

      const qrCodeUrl =
        "https://pix.gerencianet.com.br/cob/pagar/" + transactionID;

      interaction.reply({
        content:
          "Relize o pagamento através do seguinte link: " +
          qrCodeUrl +
          "\nApós realizar o pagamento, utiilze o comando /validar pagamento para validar o pagamento",
        ephemeral: true,
      });
      ////////////

      //Registra o usuário no banco de dados
      const user = await this.registerUserBySupport(interaction);

      if (user && user.vip) {
        user.vip = {
          status: false,
          vipType: supportType,
          lastTxid: txid,
          lastQrCodeUrl: qrCodeUrl,
          lastTxidStatus: "ATIVA",
        };

        try {
          await user.save();
        } catch (err) {
          console.log(err);
          return;
        }
      }

      return;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async registerUserBySupport(interaction: any) {
    const userId = interaction.user.id;
    const userAvatar =
      "https://cdn.discordapp.com/avatars/" +
      userId +
      "/" +
      interaction.user.avatar +
      ".png";

    const isUserAdmin = userHasRole({ userId, roleId: admin_role_id });

    const userInfo = {
      username: interaction.user.username,
      avatar: userAvatar,
      isUserAdmin,
      discordId: userId,
      userType: getUserType(userId),
    };

    return await new UserController().registerUserInDb(userInfo);
  }
}
