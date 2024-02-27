let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RatingSchema = new Schema(
  {
    rated_to: { type: Schema.Types.ObjectId, index: true, ref: 'users' },
    rated_by: { type: Schema.Types.ObjectId, index: true, ref: 'users' },
    rate: { type: String, default: "0.0" },
    message: { type: String, default: "" },
    tip: { type: String, default: "" },
    type: { type: Number, enum: [0, 1], default: 0 }, // 0 - rated by user, 1 - rated by provider,
    status: { type: Number, enum: [0, 1], default: 1 } // 1 - active, 0 - inactive,
  },
  { timestamps: true }
);

const rating = mongoose.model('ratings', RatingSchema);
module.exports = rating;