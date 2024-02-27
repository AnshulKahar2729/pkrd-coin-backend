let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    username: { type: String, default: "" },
    email: { type: String, default: "" },
    role: { type: Number, enum: [0, 1, 2], default: 2 }, // 0 - admin , 1 - subadmin , 2 - customer
    password: { type: String, default: "" },
    forgot_password: { type: String, default: "" },
    country_code: { type: String, default: "" },
    phone: { type: String, default: "", index: true },
    full_phone_number: { type: String, default: "", index: true },
    gender: { type: Number, enum: [0, 1, 2, 3], default: 0 }, // 1 - male, 2 - female 3- other,
    bio: { type: String, default: "" },
    dob: { type: String, default: "" }, // y-m-d
    age: { type: Number, default: 0 },
    otp: { type: String, default: "" },
    is_otp_verified: { type: Number, enum: [0, 1], default: 0 }, // 1 - yes, 0 - no,
    is_phone_verified: { type: Number, enum: [0, 1], default: 0 }, // 1 - yes, 0 - no,
    is_email_verified: { type: Number, enum: [0, 1], default: 0 }, // 1 - yes, 0 - no,
    image: { type: String, default: "" },
    is_profile_complete: { type: Number, enum: [0, 1], default: 0 }, // 0 - no ,1 - yes,
    firebase_token: { type: String, default: "" },
    location: { type: String, default: "" },
    reset_token: { type: String, default: "" },
    permissions: [],
    is_verified: { type: Number, enum: [0, 1], default: 0 }, // 1 - yes, 0 - no,
    notification: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "notifications",
    },
    notification_status: { type: Number, enum: [0, 1], default: 1 }, // 1 - active, 0 - inactive,
    access_token: { type: String, trim: true, default: "" },
    login_time: { type: String, default: "" },
    is_deleted: { type: Boolean, default: false },
    marketplace: { type: Number, enum: [0, 1, 2], default: 0 }, // 0 - buyer, 1 - seller, 2 - both
    is_accepted_terms: { type: Number, enum: [0, 1], default: 0 }, // 1 - yes, 0 - no,
    account_steps: { type: Number, enum: [0, 1, 2, 3], default: null }, // 0 - Personal Info, 1 - Verification, 2 - ID verification, 3 - Account address
    kyc_status: { type: Number, enum: [0, 1, 2, 3], default: 0 }, // 0 - pending, 1 - processing, 2 - complete, 3 - denied
    status: { type: Number, enum: [0, 1], default: 0 }, // 1 - active, 0 - inactive,
  },
  { timestamps: true }
);

const user = mongoose.model("users", UserSchema);
module.exports = user;
