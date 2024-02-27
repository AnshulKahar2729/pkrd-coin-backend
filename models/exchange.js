let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ExchangeSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, index: true, ref: "users" },
    exchange_amount_pkrd: { type: Number, default: 0 },
    exchange_value_usdt: { type: Number, default: 0 },
    wallet_address: { type: String, default: null },
    transaction_hash: { type: String, default: null },
    status: { type: Number, enum: [0, 1], default: 0 }, //0 - Pending, 1 - Processing, 2 - Complete
  },
  { timestamps: true }
);

const walletModel = mongoose.model("exchange", ExchangeSchema);
module.exports = walletModel;
