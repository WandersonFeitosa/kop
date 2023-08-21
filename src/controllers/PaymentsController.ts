import axios from "axios";
import { Aquiles } from "../models/Aquiles";
import { Player } from "../models/Player";
import { getUserType } from "../utils/userHasRole";

const pixApiUrl = process.env.PIX_API_URL as string;
const pixToken = process.env.PIX_TOKEN as string;

export class PaymentsController {
  async checkPendingPayment(discordId: string) {
    const userType = getUserType(discordId);

    let user;
    if (userType == "aquiles") {
      user = await Aquiles.findOne({ discordId });
    } else if (userType == "player") {
      user = await Player.findOne({ discordId });
    } else return false;

    const paymentStatus = user?.vip?.lastTxidStatus;

    if (paymentStatus === "CONCLUIDA") {
      return false;
    }

    if (paymentStatus === "ATIVA") {
      const txid = user?.vip?.lastTxid;

      const response = await this.checkPaymentExpiration(txid as string);

      if (response.status === "EXPIRADA") {
        await user?.updateOne({
          vip: {
            vipType: "",
            lastTxid: "",
            lastTxidStatus: "",
            lastQrCodeUrl: "",
          },
        });
        return "processing";
      }
      if (response.status === "CONCLUIDA") {
        await user?.updateOne({
          vip: {
            status: true,
            vipType: user?.vip?.vipType,
            lastTxid: user?.vip?.lastTxid,
            lastTxidStatus: "CONCLUIDA",
            lastQrCodeUrl: user?.vip?.lastQrCodeUrl,
          },
        });
        return "processing";
      }

      const transactionID = response.location.split("v2/").pop();

      const qrCodeUrl =
        "https://pix.gerencianet.com.br/cob/pagar/" + transactionID;

      return qrCodeUrl;
    }

    return false;
  }
  async checkPaymentExpiration(txid: string) {
    var config = {
      method: "GET",
      url: pixApiUrl + "/payment/" + txid,
      headers: {
        authorization: "Bearer " + pixToken,
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config)
      .then(function (response: any) {
        return response.data;
      })
      .catch(function (error: any) {
        console.log(error);
        return null;
      });

    return response;
  }
  async validatePayment(interaction: any) {
    const userType = getUserType(interaction.user.id);
    let user;
    if (userType == "aquiles") {
      user = await Aquiles.findOne({ discordId: interaction.user.id });
    } else if (userType == "player") {
      user = await Player.findOne({ discordId: interaction.user.id });
    }

    if (!user || !user.vip || !user.vip.lastTxid)
      return interaction.reply({
        content: "Você não possui nenhum pagamento pendente",
        ephemeral: true,
      });

    const txid = user?.vip?.lastTxid;

    const response = await this.checkPaymentExpiration(txid as string);

    if (response.status === "EXPIRADA") {
      await user?.updateOne({
        vip: {
          vipType: "",
          lastTxid: "",
          lastTxidStatus: "",
          lastQrCodeUrl: "",
        },
      });
      return interaction.reply({
        content: "Pagamento expirado",
        ephemeral: true,
      });
    }
    if (response.status === "ATIVA") {
      return interaction.reply({
        content:
          "Pagamento ainda não foi realizado, realize o pagamento em: " +
          user?.vip?.lastQrCodeUrl,
        ephemeral: true,
      });
    }
    if (response.status === "CONCLUIDA") {
      await user?.updateOne({
        vip: {
          status: true,
          vipType: user?.vip?.vipType,
          lastTxid: user?.vip?.lastTxid,
          lastTxidStatus: "CONCLUIDA",
          lastQrCodeUrl: user?.vip?.lastQrCodeUrl,
        },
      });
      return interaction.reply({
        content: "Pagamento validado com sucesso",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: "Erro ao validar pagamento",
      ephemeral: true,
    });
  }
  async clearPayment(interaction: any) {
    const userType = getUserType(interaction.user.id);
    let user;
    if (userType == "aquiles") {
      user = await Aquiles.findOne({ discordId: interaction.user.id });
    } else if (userType == "player") {
      user = await Player.findOne({ discordId: interaction.user.id });
    }

    if (!user || !user.vip || !user.vip.lastTxid)
      return interaction.reply({
        content: "Você não possui nenhum pagamento pendente",
        ephemeral: true,
      });

    await user?.updateOne({
      vip: {
        vipType: "",
        lastTxid: "",
        lastTxidStatus: "",
        lastQrCodeUrl: "",
      },
    });

    return interaction.reply({
      content: "Pagamento cancelado com sucesso",
      ephemeral: true,
    });
  }
}
