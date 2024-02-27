let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SocketUserSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, index: true, ref: 'users' },
    socket_id: { type: String, default: "" },
    status: { type: Number, enum: [0, 1], default: 0 }, // 1 - online, 0 - offline,
  },
  { timestamps: true }
);

const socket_user = mongoose.model('socket_users', SocketUserSchema);
module.exports = socket_user;