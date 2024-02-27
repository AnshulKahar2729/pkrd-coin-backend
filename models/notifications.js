let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let NotificationSchema = new Schema(
  {
    send_to: { type: Schema.Types.ObjectId, index: true, ref: 'users' },
    user_id: { type: Schema.Types.ObjectId, index: true, ref: 'users' },
    message: { type: String, default: "" },
    is_read: { type: Number, enum: [0, 1], default: 0 }, // 1 - yes, 0 - no,
    status: { type: Number, enum: [0, 1], default: 1 } // 1 - active, 0 - inactive,
  },
  { timestamps: true }
);

const notification = mongoose.model('notifications', NotificationSchema);
module.exports = notification;
