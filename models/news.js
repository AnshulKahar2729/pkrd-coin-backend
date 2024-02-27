let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let NewsSchema = new Schema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

const newsModel = mongoose.model('news', NewsSchema);
module.exports = newsModel;
