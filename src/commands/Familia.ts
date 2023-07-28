import mongoose from "mongoose";
import { getUsernameById } from "../utils/getUsernameById";

const bindsSchema = new mongoose.Schema({
  players: Array,
});

const ncsmpFamilySchema = new mongoose.Schema({
  name: String,
  players: Array,
  playersNames: Array,
  aquiles: Array,
  aquilesNames: Array,
});

export const NcsmpFamily = mongoose.model("ncsmp-family", ncsmpFamilySchema);

export class Familia {
  async listFamilies(interaction: any) {
    const families = await NcsmpFamily.find();
    let reply = "⊱⋅ ────── **FAMÍLIAS** ────── ⋅⊰" + "\n\n";
    families.forEach(async (family: any) => {
      if (family.playersNames.length > 1) {
        family.playersNames = family.playersNames.join("\n");
      }
      if (family.aquilesNames.length > 1) {
        family.aquilesNames = family.aquilesNames.join(", ");
      }

      setTimeout(() => {
        reply +=
          "```" +
          family.name +
          "\n\n" +
          "- " +
          family.players.length +
          " Players" +
          "\n\n" +
          family.playersNames +
          "\n\n" +
          "Aquiles: " +
          family.aquilesNames +
          "```" +
          "\n";
      }, 499);
    });

    setTimeout(() => {
      interaction.reply(reply);
    }, 500);
  }

  async updatePlayerNames() {
    const families = await NcsmpFamily.find();
    families.forEach(async (family: any) => {
      const players = family.players;
      let playersNames: any = [];
      if (players.length > 0) {
        players.forEach(async (player: any) => {
          const playerName = await getUsernameById(player);
          playersNames.push(playerName);
          console.log(playerName + " atualizado");
        });
      }
      setTimeout(() => {
        family.playersNames = playersNames;
        family.save();
      }, 15000);
    });
  }
  async updateAquilesNames() {
    const families = await NcsmpFamily.find();
    families.forEach(async (family: any) => {
      const aquiles = family.aquiles;
      let aquilesNames: any = [];
      if (aquiles.length > 0) {
        aquiles.forEach(async (aquiles: any) => {
          const aquilesName = await getUsernameById(aquiles);
          aquilesNames.push(aquilesName);
          console.log(aquilesName + " atualizado");
        });
      }
      setTimeout(() => {
        family.aquilesNames = aquilesNames;
        family.save();
      }, 15000);
    });
  }
}
