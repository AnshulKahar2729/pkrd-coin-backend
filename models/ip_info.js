let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let IPInfoSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, index: true, ref: 'users' },
    ip_address: { type: String, default: null },
    location: { type: String, default: null },
    browser: { type: String, default: null },
  },
  { timestamps: true }
);

const IPInfoModel = mongoose.model('ip_info', IPInfoSchema);
module.exports = IPInfoModel;
