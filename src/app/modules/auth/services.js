const {
  APP_DEFAULT_LANGUAGE,
  JWT_SECRET_KEY,
} = require("../../../../utils/constants/app.constants");
const {
  NOT_FOUND,
  EMAIL_NOT_EXISTS,
  PASSWORD_ERROR,
  PHONE_ALREADY_EXISTS,
  SOMETHING_WENT_WRONG,
  INCORRECT_OLD_PASSWORD,
  INVALID_TOKEN,
  EMAIL_ALREADY_EXISTS,
  ACCOUNT_DEACTIVATED,
  LINK_EXPIRED,
  EMAIL_NOT_FOUND,
} = require("../../../../utils/constants/message.constants");
const {
  SUCCESS_API,
  FAILED_API,
} = require("../../../../utils/return.response");
const { USER } = require("../../../../utils/constants/model.constants");
const helper = require("./helper");
const { decrypt, comparePass, encrypt } = require("./password");
const query = require("./query");
const {
  forgot_password_html,
  sendEmail,
  activate_account_html,
  otp_email_html,
} = require("./email");
const twilio = require("./twilio");
const jwt = require("jsonwebtoken");

//models
const MODEL_NAME = "USERS";
const MODEL_NAME_USER_DETAILS = "USER_DETAILS";
const NOTIFICATION = "NOTIFICATIONS";

module.exports = {
  /*************** singup *********************/
  signup_data: async (req, res) => {
    try {
      let create_data = await module.exports.create_user(req, res);
      if (create_data) {
        return create_data;
      } else {
        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** login *********************/
  login_data: async (req, res) => {
    try {
      let userExists;
      if (req.body.type === 0) {
        userExists = await module.exports.check_email_exists(req, res);
      }

      if (req.body.type === 1) {
        userExists = await module.exports.check_phone_number_exists(req, res);
      }

      if (userExists && userExists.is_otp_verified == 0) {
        throw new Error(EMAIL_NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }

      await module.exports.check_password(req, res, userExists);
      let create_data = await module.exports.update_login_data(
        req,
        res,
        userExists
      );
      if (create_data) {
        req.params.id = create_data._id;
        let finalData = await module.exports.get_other_profile(req, res);
        finalData.access_token = create_data.access_token;
        return finalData;
      } else {
        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },


  /*************** update password *********************/
  update_password_data: async (req, res) => {
    try {
      const { _id } = req.user;
      let dbPassword = await decrypt(req.user.password);
      let checkPassword = await comparePass(req.body.old_password, dbPassword);

      if (checkPassword == false) {
        throw new Error(INCORRECT_OLD_PASSWORD[APP_DEFAULT_LANGUAGE]);
      } else {
        let whereCondition = {
          _id,
        };
        let updateField = {
          password: await encrypt(req.body.new_password),
        };
        let updatePassword = await query.update(
          MODEL_NAME,
          whereCondition,
          updateField
        );

        if (updatePassword) {
          return {};
        } else {
          throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
        }
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** get profile *********************/
  get_profile: async (req, res) => {
    try {
      let get_info = await module.exports.get_profile(req, res);
      if (get_info) {
        return get_info;
      } else {
        throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** logout password *********************/
  logout_data: async (req, res) => {
    try {
      const { _id } = req.user;
      let whereCondition = {
        _id,
      };
      let CheckAuth = await query.find_one(MODEL_NAME, whereCondition);

      if (CheckAuth) {
        let updateField = {
          login_time: "0",
          firebase_token: "",
        };
        await query.update(MODEL_NAME, whereCondition, updateField);
        return {};
      } else {
        throw new Error(INVALID_TOKEN[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** check exist email  *********************/
  check_signup_email_exists: async (req, res) => {
    try {
      const { email } = req.body;
      let whereCondition = {
        email,
      };
      let getUser = await query.find_one(MODEL_NAME, whereCondition);

      if (getUser && getUser.is_email_verified == 1) {
        throw new Error(EMAIL_ALREADY_EXISTS[APP_DEFAULT_LANGUAGE]);
      } else {
        return getUser;
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** check exist phone  *********************/
  check_phone_number_exists: async (req, res) => {
    try {
      const { full_phone_number } = req.body;
      let whereCondition = {
        full_phone_number: `${req.body.country_code}${req.body.phone}`,
      };
      let getUser = await query.find_one(MODEL_NAME, whereCondition);
      if (getUser) {
        return getUser;
      } else {
        throw new Error(EMAIL_NOT_EXISTS[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** create user  *********************/
  create_user: async (req, res) => {
    try {
      let whereCondition = {
        $or: [
          { email: req.body.email },
          { full_phone_number: req.body.full_phone_number },
        ],
      };
      let getexistingUser = await query.find_one(MODEL_NAME, whereCondition);
      if (getexistingUser && getexistingUser.status != "0") {
        return FAILED_API(res, EMAIL_ALREADY_EXISTS[APP_DEFAULT_LANGUAGE]);
      }

      if (req.body.password) {
        req.body.password = await encrypt(req.body.password);
      }

      let time = helper.unixTimestamp();
      req.body.login_time = time;
      req.body.join_platform_date = time;
      req.body.email = req.body.email.toLowerCase();

      let create_data = await query.find_one_and_update(
        MODEL_NAME,
        whereCondition,
        req.body
      );
      if (create_data) {
        let jwt_data = await module.exports.generate_jwt_token(
          req,
          res,
          create_data
        );
        if (jwt_data) {
          await query.create(NOTIFICATION, { user_id: create_data._id, message: "Congratulations, you have successfully created an account!" });
          return jwt_data;
        } else {
          throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
        }
      } else {
        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** generate jwt token  *********************/
  generate_jwt_token: async (req, res, userData) => {
    try {
      let whereCondition = {
        _id: userData._id,
      };
      let getData = await query.find_one(MODEL_NAME, whereCondition);

      var token = jwt.sign(
        {
          data: {
            _id: getData._id,
            // email: create_user.email,
            login_time: getData.login_time,
          },
        },
        JWT_SECRET_KEY
      );

      getData.access_token = token;
      if (getData) {
        return getData;
      } else {
        throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** get profile  *********************/
  get_other_profile: async (req, res) => {
    try {
      const { id } = req.params;
      let whereCondition = {
        _id: id,
      };
      let getUser = await query.find_one(MODEL_NAME, whereCondition);
      if (getUser) {
        return getUser;
      } else {
        throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** check email  *********************/
  check_email_exists: async (req, res) => {
    try {
      const { email, role } = req.body;
      const lowerCaseEmail = email.toLowerCase();
      let whereCondition = { email: lowerCaseEmail };
      let getUser = await query.find_one(MODEL_NAME, whereCondition);
      if (getUser) {
        return getUser;
      } else {
        throw new Error(EMAIL_NOT_EXISTS[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** check password  *********************/
  check_password: async (req, res, userData) => {
    try {
      let dbPassword = await decrypt(userData.password);
      let checkPassword = await comparePass(req.body.password, dbPassword);
      if (checkPassword) {
        return userData;
      } else {
        throw new Error(PASSWORD_ERROR[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** update login data  *********************/
  update_login_data: async (req, res, userData) => {
    try {
      let time = helper.unixTimestamp();
      let updateField = {
        login_time: time,
        firebase_token: req.body.firebase_token ? req.body.firebase_token : "",
      };

      let whereCondition = {
        _id: userData._id,
      };

      let updateData = await query.update(
        MODEL_NAME,
        whereCondition,
        updateField
      );
      if (updateData) {
        let jwt_data = await module.exports.generate_jwt_token(
          req,
          res,
          userData
        );
        if (jwt_data) {
          return jwt_data;
        } else {
          throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
        }
      } else {
        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** forgot pasword app *********************/
  forgot_password_data: async (req, res) => {
    try {
      const { email } = req.body;
      let whereCondition = {
        email,
      };
      let checkUserId = await query.find_one(MODEL_NAME, whereCondition);

      if (!checkUserId) {
        throw new Error(EMAIL_NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }

      let email_forgot_password_hash =
        checkUserId._id.toString() +
        helper.create_auth() +
        helper.create_auth();
      email_forgot_password_hash = email_forgot_password_hash.toUpperCase();

      let updateData = {
        reset_token: email_forgot_password_hash,
      };

      await query.update(MODEL_NAME, whereCondition, updateData);

      let fullUrl = req.protocol + "://" + req.get("host");

      // let html = `<a href="http://${req.get('host')}/api/reset_password/${email_forgot_password_hash}">Click here to reset password</a>`;

      let html = await forgot_password_html(
        fullUrl,
        email_forgot_password_hash
      );
      let email_object = {
        to: checkUserId.email.trim(),
        subject: "Life Vault Reset Password",
        html: html,
      };

      await sendEmail(email_object);
      // console.log(html)
      return {};
    } catch (error) {
      throw error;
    }
  },

  /*************** edit profile*********************/
  edit_profile_data: async (req, res) => {
    try {
      const { _id } = req.user;

      let whereCondition = {
        _id,
      };
      if (req.body.longitude && req.body.latitude) {
        req.body.geometry = [req.body.longitude, req.body.latitude];
      }
      // if(req.body.country_code && req.body.phone){
      //     req.body.phone = req.body.country_code+''+req.body.phone;
      // }
      let updated = await query.update(MODEL_NAME, whereCondition, req.body);
      if (updated) {
        let get_user_info = await query.find_one(MODEL_NAME_USER_DETAILS, {
          user_id: _id,
        });
        if (get_user_info) {
          await query.update(
            MODEL_NAME_USER_DETAILS,
            { user_id: _id },
            req.body
          );
        } else {
          req.body.user_id = _id;
          await query.create(MODEL_NAME_USER_DETAILS, req.body);
        }
        let get_info = await module.exports.get_provider_info(req, res);
        return get_info;
      } else {
        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  get_profile: async (req, res) => {
    try {
      const { _id } = req.user;
      let whereCondition = {
        _id: _id,
      };
      let get_profile_info = await query.find_one(MODEL_NAME, whereCondition);
      return get_profile_info;
    } catch (error) {
      throw error;
    }
  },

  /*************** verify phone number email *********************/
  verify_phone_number_email_data: async (req, res) => {
    try {
      let request_otp;
      if (req.body.type == 1) {
        //otp send on phone number
        //type 1 = random 5 digit, 2 = 1212 otp
        request_otp = await twilio.send_otp(req.body);
        let updatedField = {
          phone: req.body.phone,
          country_code: req.body.country_code,
          full_phone_number: req.body.full_phone_number,
          otp: request_otp,
        };
        await query.update(MODEL_NAME, { _id: req.user._id }, updatedField);
      }
      if (req.body.type == 0) {
        //otp send on email
        let email_html = await otp_email_html(request_otp);
        let email_object = {
          to: req.body.email.trim(),
          subject: "Life Vault Otp Verification",
          html: email_html,
        };

        await sendEmail(email_object);
        await query.update(MODEL_NAME, { _id: req.user._id }, updatedField);
      }
      return {};
    } catch (error) {
      throw error;
    }
  },

  /*************** update phone number email *********************/
  update_phone_email_data: async (req, res) => {
    try {
      const { email, full_phone_number, type } = req.body;
      let whereCondition = {
        $and: [{ email: email }, { full_phone_number: full_phone_number }],
      };
      let find_user = await query.find_one(MODEL_NAME, whereCondition);
      console.log(find_user);
      await module.exports.check_signup_email_exist_(req, res);
      await module.exports.check_phone_number_exist_(req, res);
      // return

      if (!find_user) {
        //otp with phone number
        let request_otp = await twilio.send_otp(req.body);
        let updatedField = {
          phone: req.body.phone,
          country_code: req.body.country_code,
          full_phone_number: full_phone_number,
          email: email,
          otp: request_otp,
        };
        //otp with email
        let email_html = await otp_email_html(request_otp);
        let email_object = {
          to: req.body.email ?? req.body.email.trim(),
          subject: "Life Vault Otp Verification",
          html: email_html,
        };
        await sendEmail(email_object);
        await query.update(MODEL_NAME, { _id: req.user._id }, updatedField);
      } else {
        await query.update(MODEL_NAME, { _id: req.user._id }, { otp: 0 });
      }
      let get_info = await module.exports.get_provider_info(req, res);
      return get_info;
    } catch (error) {
      throw error;
    }
  },

  /*************** check exist email  *********************/
  check_signup_email_exist_: async (req, res) => {
    try {
      const { email } = req.body;
      let whereCondition = {
        email,
        _id: {
          $ne: req.user._id,
        },
      };
      let getUser = await query.find_one(MODEL_NAME, whereCondition);

      if (getUser) {
        throw new Error(EMAIL_ALREADY_EXISTS[APP_DEFAULT_LANGUAGE]);
      } else {
        return getUser;
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** check exist phone  *********************/
  check_phone_number_exist_: async (req, res) => {
    try {
      const { full_phone_number } = req.body;
      let whereCondition = {
        full_phone_number,
        _id: {
          $ne: req.user._id,
        },
      };
      let getUser = await query.find_one(MODEL_NAME, whereCondition);

      if (getUser) {
        throw new Error(PHONE_ALREADY_EXISTS[APP_DEFAULT_LANGUAGE]);
      } else {
        return getUser;
      }
    } catch (error) {
      throw error;
    }
  },
};
