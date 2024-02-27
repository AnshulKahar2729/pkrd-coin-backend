const { APP_DEFAULT_LANGUAGE, JWT_SECRET_KEY } = require('../../../../utils/constants/app.constants');
const { NOT_FOUND, EMAIL_NOT_EXISTS, PASSWORD_ERROR, EMAIL_NOT_FOUND, PASSWORD_NOT_MATCHED, LINK_EXPIRED, SOMETHING_WENT_WRONG, INCORRECT_OLD_PASSWORD, INVALID_TOKEN } = require('../../../../utils/constants/message.constants');
const { USER, POSTS, REPORTS } = require('../../../../utils/constants/model.constants');
const helper = require('./helper');
const { decrypt, comparePass, encrypt } = require('./password');
const query = require('./query');
const password = require('./password');
const jwt = require('jsonwebtoken');
const { forgot_password_html, sendEmail } = require('./email');
//models
const MODEL_NAME = 'USERS'

module.exports = {

    /*************** check email exists *********************/
    check_email_exists: async (req, res) => {
        try {
            const { email } = req.body
            let whereCondition = {
                email,
                role: { $in: [USER.ROLE.ADMIN, USER.ROLE.SUBADMIN] }
            }
            let getUser = await query.find_one(MODEL_NAME, whereCondition)

            if (getUser) {
                return getUser
            } else {
                throw new Error(EMAIL_NOT_EXISTS[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** match admin password *********************/
    check_admin_password: async (req, res, userData) => {
        try {
            let dbPassword = await decrypt(userData.password)
            let checkPassword = await comparePass(req.body.password, dbPassword);
            if (checkPassword) {
                delete userData.password;
                return userData
            } else {
                throw new Error(PASSWORD_ERROR[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /***************  update admin login data *********************/
    update_login_data: async (req, res, userData) => {
        try {
            let time = helper.unixTimestamp();
            let updateField = {
                login_time: time,
            }

            let whereCondition = {
                _id: userData._id
            }

            let updateData = await query.update(MODEL_NAME, whereCondition, updateField)
            if (updateData) {
                return true
            } else {
                throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** generate jwt token *********************/
    generate_jwt_token: async (req, res, userData) => {
        try {
            let whereCondition = {
                _id: userData._id
            }
            let getData = await query.find_one(MODEL_NAME, whereCondition)

            var token = jwt.sign({
                data: {
                    _id: getData._id,
                    email: getData.email,
                    login_time: getData.login_time,
                }
            }, JWT_SECRET_KEY);

            getData.access_token = token;
            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }

        } catch (error) {
            throw error
        }
    },
    /*************** dashboard *********************/
    dashboard_count: async (req, res) => {
        try {
            let getData = {
                customer: await query.find_all_count('USERS', { role: USER.ROLE.CUSTOMER }),
                provider: await query.find_all_count('USERS', { role: USER.ROLE.PROVIDER }),
                subadmin: await query.find_all_count('USERS', { role: USER.ROLE.SUBADMIN }),
                categories: await query.find_all_count('CATEGORIES', {}),
                subcategories: await query.find_all_count('SUBCATEGORIES', {}),
                posts: await query.find_all_count('POSTS', { added_type: POSTS.ADDED_TYPE.ADMIN }),
                provider_posts: await query.find_all_count('POSTS', { added_type: POSTS.ADDED_TYPE.PROVIDER }),
                ratings: await query.find_all_count('RATINGS', {}),
                reported_users: await query.find_all_count('REPORTS', { type: REPORTS.TYPE.REPORTED_USER }),
                reported_booking: await query.find_all_count('REPORTS', { type: REPORTS.TYPE.REPORTED_BOOKING }),
                content_pages: await query.find_all_count('CONTENT', {}),
                faq: await query.find_all_count('FAQ', {}),
                onboarding: await query.find_all_count('ONBOARDING_SCREENS', {}),
                provider_certificate: await query.find_all_count('USER_DETAILS', { certificates: { $exists: true, $ne: [] } }),
                booking: await query.find_all_count('BOOKINGS', {}),
                settings: await query.find_all_count('SETTINGS', {}),
                certificate_questions: await query.find_all_count('CERTIFICATE_QUESTIONS', {}),
                promocode: await query.find_all_count('PROMOCODES', {}),
                accounting: await query.find_all_count('WITHDRAWL_REQUESTS', {}),
                products: await query.find_all_count('PRODUCTS', {}),
                orders: await query.find_all_count('ORDERS', {}),
                account_setting: await query.find_all_count('ACCOUNT_SETTINGS', {}),
            }
            if (getData) {
                return getData
            } else {
                return
            }
        } catch (error) {
            throw error
        }
    },

    /*************** get admin profile *********************/
    get_admin_profile: async (req, res) => {
        try {
            const { _id } = req.admin
            let whereCondition = {
                _id
            }
            let getUser = await query.find_one(MODEL_NAME, whereCondition);
            let posts = await query.find_all_count('POSTS');
            let products = await query.find_all_count('PRODUCTS');
            if (getUser) {
                getUser = JSON.parse(JSON.stringify(getUser));
                getUser.posts = posts
                getUser.products = products
                return getUser
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** update admin profile *********************/
    update_admin_profile: async (req, res) => {
        try {
            const { _id } = req.admin

            let whereCondition = {
                _id
            }

            let update_profile = await query.update(MODEL_NAME, whereCondition, req.body);
            if (update_profile) {
                let getData = await module.exports.get_admin_profile(req, res)
                return getData
            } else {
                throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** update admin password *********************/
    update_admin_password: async (req, res) => {
        try {
            const { _id } = req.admin
            let dbPassword = await decrypt(req.admin.password)
            let checkPassword = await comparePass(req.body.old_password, dbPassword);

            if (checkPassword == false) {
                throw new Error(INCORRECT_OLD_PASSWORD[APP_DEFAULT_LANGUAGE])
            } else {
                let whereCondition = {
                    _id
                }
                let updateField = {
                    password: await encrypt(req.body.new_password)
                }
                let updatePassword = await query.update(MODEL_NAME, whereCondition, updateField);

                if (updatePassword) {
                    return {}
                } else {
                    throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
                }
            }
        } catch (error) {
            throw error
        }
    },

    /*************** logout admin *********************/
    admin_logout: async (req, res) => {
        try {
            const { _id } = req.admin
            let whereCondition = {
                _id
            }
            let CheckAuth = await query.find_one(MODEL_NAME, whereCondition)

            if (CheckAuth) {
                let updateField = {
                    login_time: '0',
                }
                await query.update(MODEL_NAME, whereCondition, updateField)
                return {}
            } else {
                throw new Error(INVALID_TOKEN[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** forgot pasword admin *********************/
    forgot_password_data: async (req, res) => {
        try {
            const { email } = req.body
            let whereCondition = {
                email
            }
            let checkUserId = await query.find_one(MODEL_NAME, whereCondition)

            if (!checkUserId) {
                throw new Error(EMAIL_NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }

            let email_forgot_password_hash = (checkUserId.id).toString() + helper.create_auth() + helper.create_auth();
            email_forgot_password_hash = email_forgot_password_hash.toUpperCase();

            let updateData = {
                reset_token: email_forgot_password_hash
            }

            await query.update(MODEL_NAME, whereCondition, updateData)

            let fullUrl = req.protocol + '://' + req.get('host');

            // let html = `<a href="http://${req.get('host')}/api/reset_password/${email_forgot_password_hash}">Click here to reset password</a>`;

            let html = await forgot_password_html(fullUrl, email_forgot_password_hash);
            let email_object = {
                to: checkUserId.email.trim(),
                subject: 'Life Vault Reset Password',
                html: html
            }

            await sendEmail(email_object)
            console.log(html)
            return {}

        } catch (error) {
            throw error
        }
    },
    /**************reset password form ************/
    reset_password_form_data: async (req, res) => {
        try {
            let token = req.params.token;

            let whereConditionForCheck = {
                reset_token: token
            }
            let find = await query.find_one(MODEL_NAME, whereConditionForCheck)

            if (find) {
                if (find.reset_token.trim() == '') {
                    throw new Error(LINK_EXPIRED[APP_DEFAULT_LANGUAGE])
                }
            } else {
                throw new Error(LINK_EXPIRED[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            throw err
        }
    },

    /**************reset password ************/
    reset_password_data: async (req, res) => {
        try {
            let whereConditionForCheck = {
                reset_token: req.body.reset_token
            }
            let find = await query.find_one(MODEL_NAME, whereConditionForCheck)

            if (find) {
                if (req.body.new_password.trim() == req.body.confirm_password.trim()) {
                    const Hash = await password.encrypt(req.body.confirm_password);

                    let whereCondition = {
                        _id: find._id
                    }

                    let updateField = {
                        password: Hash
                    }

                    let resetPassword = await query.update(MODEL_NAME, whereCondition, updateField)

                    if (resetPassword) {
                        let updateField = {
                            reset_token: ''
                        }

                        await query.update(MODEL_NAME, whereCondition, updateField)
                        return {};
                    } else {
                        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
                    }
                } else {
                    throw new Error(PASSWORD_NOT_MATCHED[APP_DEFAULT_LANGUAGE])
                }
            } else {
                throw new Error(LINK_EXPIRED[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            throw err
        }
    },


}