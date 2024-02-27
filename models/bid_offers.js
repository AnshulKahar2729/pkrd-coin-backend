let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BidOfferSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, index: true, ref: 'users' },
    bidType: { type: Number, enum: [0, 1], default: 1 }, // 1 - sell, 0 - buy,
    paymentMethod: { type: String, default: null },
    currency: { type: String, default: null },
    minAmount: { type: Number, default: 0 },
    maxAmount: { type: Number, default: 0 },
    averageTime: { type: String, default: null },
    profitPercentage: { type: Number, default: 0 },
    status: { type: Number, enum: [0, 1, 2], default: 1 } // 2-expired,  1 - active, 0 - inactive,
  },
  { timestamps: true }
);

const bidOffersModel = mongoose.model('bid_offers', BidOfferSchema);
module.exports = bidOffersModel;
