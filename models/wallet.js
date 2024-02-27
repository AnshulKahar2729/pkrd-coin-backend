let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let WalletSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, index: true, ref: "users" },
    name: { type: String, default: 'PKRD' },
    wallet_balance: { type: Number, default: 0 },
    wallet_address: { type: String, default: null },
    private_key: { type: String, default: null },
    public_key: { type: String, default: null },
  },
  { timestamps: true }
);

const walletModel = mongoose.model("wallet", WalletSchema);
module.exports = walletModel;
