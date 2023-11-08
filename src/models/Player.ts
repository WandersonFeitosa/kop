import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  avatar: String,
  familyId: String,
  isUserAdmin: Boolean,
  vip: {
    status: Boolean,
    vipType: String,
    lastTxid: String,
    lastQrCodeUrl: String,
    lastTxidStatus: String,
  },
  familyInvites: [String],
});

export const Player = mongoose.model('Player', PlayerSchema);
