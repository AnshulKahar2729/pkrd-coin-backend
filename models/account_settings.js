let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Accountschema = new Schema(
  {
    stripe: {
      secret_key: { type: String, default: "" },
      publish_key: { type: String, default: "" },
      mode: { type: Number, enum: [0, 1], default: 0 } // 1 - live, 0 - test,
    },
    twillio: {
      accountsid: { type: String, default: "" },
      auth_token: { type: String, default: "" },
      twillio_from: { type: String, default: "" },
    },
    mailgun: {
      mailgun_api_key: { type: String, default: "" },
      mailgun_domain: { type: String, default: "" },
      mailgun_from: { type: String, default: "" },
      mailgun_auth: { type: String, default: "" },
    },
    aws: {
      sceret_access_key: { type: String, default: "" },
      sceret_access_id: { type: String, default: "" },
      region_name: { type: String, default: "" },
      bucket_name: { type: String, default: "" },
    }
  },
  { timestamps: true }
);

const account_settings = mongoose.model('account_settings', Accountschema);
module.exports = account_settings;