import mongoose from "mongoose";

const AquilesSchema = new mongoose.Schema({
  username: String,
  avatar: String,
  family: String,
  isUserAdmin: Boolean,
  discordId: String,
  vip: {
    status: Boolean,
    vipType: String,
    lastTxid: String,
    lastQrCodeUrl: String,
    lastTxidStatus: String,
  },
  familyInvites: [String],
  completedMissions: [
    {
      id: String,
      images: [String],
      pending: Boolean,
      aproved: Boolean,
      completedDate: Date,
    },
  ],
});

export const Aquiles = mongoose.model("Aquiles", AquilesSchema);
