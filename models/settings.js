let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SettingSchema = new Schema(
  {
    language: { type: Number, enum: [0, 1], default: 1 }, // 1 - english, 0 - chinese,
    free_subscription: { type: Number, enum: [0, 1], default: 1 }, // 1 - enable, 0 - disable,
    free_subscription_space: { type: Number, default: 0 },
    payment_mode: { type: Number, enum: [0, 1], default: 0 }, // 1 - live, 0 - test,
    stripe_key: {
      sandbox: {
        public_key: { type: String },
        secret_key: { type: String }
      },
      live: {
        public_key: { type: String },
        secret_key: { type: String }
      }
    },
    status: { type: Number, enum: [0, 1], default: 1 }, // 1 - active, 0 - inactive,
  },
  { timestamps: true }
);

const setting = mongoose.model('settings', SettingSchema);
module.exports = setting;