let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let TradeSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, index: true, ref: "users" },
    engage_user_id: { type: Schema.Types.ObjectId, index: true, ref: "users" },
    bid_id: { type: Schema.Types.ObjectId, index: true, ref: "bid_offers" },
    complete_by_user: { type: Number, enum: [0, 1], default: 0 }, // 1 - Yes, 0 - No
    complete_by_engage_user: { type: Number, enum: [0, 1], default: 0 }, // 1 - Yes, 0 - No
    description: { type: String, default: null },
    transaction_hash: { type: String, default: null },
    start_time: { type: String, default: null },
    status: { type: Number, enum: [0, 1, 2, 3], default: 1 }, // 1 - active, 0 - expired, 2 - complete, 3- cancelled
    PKRDRate: { type: Number, default: 0 },
    USDAmount: { type: Number, default: 0 },
    PKRDAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const tradeModel = mongoose.model("trade", TradeSchema);
module.exports = tradeModel;
