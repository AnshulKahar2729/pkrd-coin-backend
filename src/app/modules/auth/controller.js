const { signup_data, login_data, logout_data, get_profile, forgot_password_data, update_password_data, activate_account_data, edit_profile_data, social_login_data, complete_profile_data, verify_phone_number_email_data, update_phone_email_data } = require('./services');
const { FAILED_API, SUCCESS_API } = require('../../../../utils/return.response');
const { SIGNUP_SUCCESS, SOMETHING_WENT_WRONG, FORGOT_PASSWORD, LOGIN_SUCCESS, GET_PROFILE, PASSWORD_UPDATED, OTP_VERIFIED, INVALID_OTP, LOGOUT, INVALID_ROLE, ALREADY_VERIFIED, CAN_NOT_SEND_OTP, OTP_SENT_SUCCESSFULLY, ACCOUNT_ACTIVATION_SUCCESS, LINK_EXPIRED, UPDATE_PROFILE, UPDATE_SUCCESS } = require('../../../../utils/constants/message.constants');
const { USER } = require('../../../../utils/constants/model.constants');
const { APP_DEFAULT_LANGUAGE, STATIC_OTP } = require('../../../../utils/constants/app.constants');
const query = require('./query');
const twilio = require('./twilio');
const { sendEmail, otp_email_html } = require('./email');
const helper = require('./helper');
//models
const MODEL_NAME = 'USERS'

module.exports = {
    /*************** sign up  *********************/
    sign_up: async (req, res) => {
        console.log("signupController");
        try {
            let data = await signup_data(req, res)
            if (data) {
                return SUCCESS_API(res, SIGNUP_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

    /*************** login *********************/
    login: async (req, res) => {
        try {
            let data = await login_data(req, res);
            console.log(data, "--------");
            if (data) {
                return SUCCESS_API(res, LOGIN_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

    /*************** verify otp *********************/
    verify_otp: async (req, res) => {
        try {
            let whereCondition = {
                ...(req.body.type == 0 ? { email: req.body.email } : req.body.type == 1 ? { full_phone_number: req.body.country_code + req.body.phone } :
                    { email: req.body.email, full_phone_number: req.body.country_code + req.body.phone}
                ),
            }
            let find_exiting_user = await query.find_one(MODEL_NAME, whereCondition);

            if (req.body.type == 1 && find_exiting_user && find_exiting_user.is_otp_verified == USER.IS_OTP_VERIFIED.YES) {
                return FAILED_API(res, ALREADY_VERIFIED[APP_DEFAULT_LANGUAGE])
            }
            if (req.body.type == 0 && find_exiting_user && find_exiting_user.is_email_verified == USER.IS_EMAIL_VERIFIED.YES) {
                return FAILED_API(res, ALREADY_VERIFIED[APP_DEFAULT_LANGUAGE])
            }
            if (req.body.type == 2 && find_exiting_user && find_exiting_user.is_email_verified == USER.IS_EMAIL_VERIFIED.YES && find_exiting_user.is_otp_verified == USER.IS_OTP_VERIFIED.YES) {
                return FAILED_API(res, ALREADY_VERIFIED[APP_DEFAULT_LANGUAGE])
            }

            // if ((parseInt(req.body.otp) != find_exiting_user?.otp)) {
            //     return FAILED_API(res, INVALID_OTP[APP_DEFAULT_LANGUAGE])
            // }

            if (parseInt(req.body.otp) != '000000') {
                return FAILED_API(res, INVALID_OTP[APP_DEFAULT_LANGUAGE])
            }
            let updateField = {
                ...(req.body.type == 1 ? { is_otp_verified: USER.IS_OTP_VERIFIED.YES, is_phone_verified: USER.IS_PHONE_VERIFIED.YES } : {}),
                ...(req.body.type == 0 ? { is_email_verified: USER.IS_EMAIL_VERIFIED.YES } : {}),
                ...(req.body.type == 2 ? {
                    is_email_verified: USER.IS_EMAIL_VERIFIED.YES,
                    is_otp_verified: USER.IS_OTP_VERIFIED.YES,
                    is_phone_verified: USER.IS_PHONE_VERIFIED.YES
                } : {}),
                otp: 0
            }

            await query.update(MODEL_NAME, whereCondition, updateField)
            return SUCCESS_API(res, OTP_VERIFIED[APP_DEFAULT_LANGUAGE], {})
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

    /*************** resend otp *********************/
    resend_otp: async (req, res) => {
        try {
            let whereCondition = {
                ...(req.body.type == 0 ? { email: req.body.email } : req.body.type == 1 ? { full_phone_number: req.body.country_code+ req.body.phone} :
                    { $or: [{ email: req.body.email }, { full_phone_number: req.body.country_code+ req.body.phone, }] }
                ),
            }
            console.log(req.body)
            console.log(whereCondition.full_phone_number, "whereCondition");
            let find_exiting_user = await query.find_one(MODEL_NAME, whereCondition);
            // return
            if (find_exiting_user && find_exiting_user.is_otp_verified == 1 && find_exiting_user.is_email_verified == 1) {
                return FAILED_API(res, CAN_NOT_SEND_OTP[APP_DEFAULT_LANGUAGE])
            }
            let otp = await helper.getOtp(1);

            if (req.body.type == 1) {
                otp = await twilio.send_otp(whereCondition);
            }

            if (req.body.type == 0) {
                let email_html = await otp_email_html(otp);
                let email_object = {
                    to: req.body.email.trim(),
                    subject: 'PKRD Otp Verification',
                    html: email_html
                }
                await sendEmail(email_object)
            }
            if (req.body.type == 2) {
                otp = await twilio.send_otp(req.body);
                let email_html = await otp_email_html(otp);
                let email_object = {
                    to: req.body.email.trim(),
                    subject: 'Life Vault Otp Verification',
                    html: email_html
                }
                await sendEmail(email_object)
            }


            let updateField = {
                otp: otp,
                ...(req.body.type == 0 ? { email: req.body.email, is_email_verified: USER.IS_EMAIL_VERIFIED.NO } : {}),
                ...(req.body.type == 1 ? { is_phone_verified: req.body.is_phone_verified, is_otp_verified: USER.IS_OTP_VERIFIED.NO } : {}),
                ...(req.body.type == 2 ? {
                    is_email_verified: USER.IS_EMAIL_VERIFIED.NO,
                    is_otp_verified: USER.IS_OTP_VERIFIED.NO,
                    is_phone_verified: USER.IS_PHONE_VERIFIED.NO
                } : {})
            }

            await query.update(MODEL_NAME, whereCondition, updateField)

            let getData = await query.find_one(MODEL_NAME, whereCondition)
            getData = getData ? getData : {}
            return SUCCESS_API(res, OTP_SENT_SUCCESSFULLY[APP_DEFAULT_LANGUAGE], getData)
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

    /*************** forgot password *********************/
    forgot_password: async (req, res) => {
        try {
            let data = await forgot_password_data(req, res)
            if (data) {
                return SUCCESS_API(res, FORGOT_PASSWORD[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

    /*************** change password *********************/
    change_password: async (req, res) => {
        try {
            let data = await update_password_data(req, res)
            if (data) {
                return SUCCESS_API(res, PASSWORD_UPDATED[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** get profile *********************/
    profile: async (req, res) => {
        try {
            let data = await get_profile(req, res)
            if (data) {
                return SUCCESS_API(res, GET_PROFILE[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** edit profile *********************/
    edit_profile: async (req, res) => {
        try {
            let data = await edit_profile_data(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_PROFILE[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /***************complete_profile  ************/
    complete_kyc_profile: async (req, res) => {
        try {
            let data = await complete_profile_data(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** logout *********************/
    logout: async (req, res) => {
        try {
            let data = await logout_data(req, res)
            if (data) {
                return SUCCESS_API(res, LOGOUT[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** verify_phone_number_email   *********************/
    verify_phone_number_email: async (req, res) => {
        try {
            let data = await verify_phone_number_email_data(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

    /*************** update_phone_number_email   *********************/
    update_phone_email: async (req, res) => {
        try {
            let data = await update_phone_email_data(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

}
