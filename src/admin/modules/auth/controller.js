const { check_email_exists, check_admin_password, generate_jwt_token, update_login_data, dashboard_count, admin_logout, forgot_password_data, get_admin_profile, update_admin_password, reset_password_data, reset_password_form_data, update_admin_profile } = require('./services');
const { APP_DEFAULT_LANGUAGE } = require('../../../../utils/constants/app.constants');
const { LOGIN_SUCCESS, SOMETHING_WENT_WRONG, GET_PROFILE, UPDATE_PROFILE, GET_DATA, PASSWORD_RESET_SUCCESS, LINK_EXPIRED, PASSWORD_UPDATED, FORGOT_PASSWORD, LOGOUT } = require('../../../../utils/constants/message.constants');
const { SUCCESS_API, FAILED_API } = require('../../../../utils/return.response');

module.exports = {
    /*************** login *********************/
    login: async (req, res) => {
        try {
            console.log("login controller")
            let checkUser = await check_email_exists(req, res);

            let getUser = await check_admin_password(req, res, checkUser);

            await update_login_data(req, res, getUser);

            let data = await generate_jwt_token(req, res, getUser);
            
            if (data) {
                return SUCCESS_API(res, LOGIN_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err);
        }
    },
    /*************** dashboard *********************/
    dashboard: async (req, res) => {
        try {
            let data = await dashboard_count(req, res)
            if (data) {
                return SUCCESS_API(res, GET_DATA[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** profile *********************/
    profile: async (req, res) => {
        try {
            let data = await get_admin_profile(req, res)
            if (data) {
                return SUCCESS_API(res, GET_PROFILE[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** update profile *********************/
    edit_profile: async (req, res) => {
        try {
            let data = await update_admin_profile(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_PROFILE[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** change password *********************/
    change_password: async (req, res) => {
        try {
            let data = await update_admin_password(req, res)
            if (data) {
                return SUCCESS_API(res, PASSWORD_UPDATED[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err)
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
    /**************reset password form ************/
    reset_password_form: async (req, res) => {
        try {
            let data = await reset_password_form_data(req, res)
            if (data) {
                return SUCCESS_API(res, LINK_EXPIRED[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },
    /**************reset password ************/
    reset_password: async (req, res) => {
        try {
            let data = await reset_password_data(req, res)
            if (data) {
                return SUCCESS_API(res, PASSWORD_RESET_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, LINK_EXPIRED[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },


    /*************** logout *********************/
    logout: async (req, res) => {
        try {
            let data = await admin_logout(req, res)
            if (data) {
                return SUCCESS_API(res, LOGOUT[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },


}