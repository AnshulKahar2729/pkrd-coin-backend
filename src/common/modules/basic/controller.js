'use strict';

const aes = require('./aes');
const { FAILED_API, SUCCESS_API } = require('../../../../utils/return.response');
const { SOMETHING_WENT_WRONG, CREATE_SUCCESS, GET_LIST, PAGE_FOUND, DELETE_SUCCESS, UPDATE_SUCCESS, GET_DATA } = require('../../../../utils/constants/message.constants');
const { APP_DEFAULT_LANGUAGE, SECRET_KEY, PUBLISH_KEY } = require('../../../../utils/constants/app.constants');
const { check_page_exists, admin_signup_data, content_page_data, setting_list_data, post_video_list_data, certificate_question_date, category_list_data, subcategory_list_data, onboarding_screen_data, subcategory_detail_data, get_page_data, accpet_cms_data } = require('./services');
const { USER } = require('../../../../utils/constants/model.constants');
const { uploadImageOnBuket, deleteImageOnBuket } = require('./files');
const imageUpload = uploadImageOnBuket;

module.exports = {

    /*************** generate secret publish key *********************/
    encryptionForSkPk: async (req, res) => {
        try {

            if ((req.headers.secret_key !== SECRET_KEY) || (req.headers.publish_key !== PUBLISH_KEY)) {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }

            //encrypt data
            let encryptedSkData = await aes.encryption(SECRET_KEY)
            let encryptedPkData = await aes.encryption(PUBLISH_KEY)

            //decrypt data
            let decryptedSkData = await aes.decryption(encryptedSkData)
            let decryptedPkData = await aes.decryption(encryptedPkData)

            encryptedSkData = 'sk_' + encryptedSkData
            encryptedPkData = 'pk_' + encryptedPkData

            return SUCCESS_API(res, 'data', { encryptedSkData, decryptedSkData, encryptedPkData, decryptedPkData })

        } catch (err) {
            console.log(err, '------err--------');
            return FAILED_API(res, err)
        }
    },

    /***************content pages*********************/
    page: async (req, res) => {
        try {
            await check_page_exists(req, res)

            let data = await get_page_data(req, res)
            if (data) {
                return SUCCESS_API(res, PAGE_FOUND[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /***************image upload*********************/
    upload_image_s3_buket: async (req, res) => {
        try {
            let file = req.files.file;
            let folder = req.body.folder;
            let data = await uploadImageOnBuket(file, folder);
            if (data) {
                return SUCCESS_API(res, CREATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** delete image*********************/
    delete_image_s3_buket: async (req, res) => {
        try {

            let file = req.body.file;
            let data = await deleteImageOnBuket(file);
            if (data) {
                return SUCCESS_API(res, DELETE_SUCCESS[APP_DEFAULT_LANGUAGE], {})
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** admin_signup *********************/
    admin_signup: async (req, res) => {
        try {
            const role = USER.ROLE.ADMIN;
            let data = await admin_signup_data(role);
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], {})
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },
    /************************* Content Pages*****************************/
    content_page: async (req, res) => {
        console.log(req.body, "-=-=-=-=-=-=-==-=");
        try {
            let data = await content_page_data(req, res);
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], {})
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },


    /*************** Category list *********************/
    category_list: async (req, res) => {
        try {
            let data = await category_list_data(req, res)
            if (data) {
                return SUCCESS_API(res, GET_LIST[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },
    /*************** subCategory list *********************/
    subcategory_list: async (req, res) => {
        try {
            let data = await subcategory_list_data(req, res)
            if (data) {
                return SUCCESS_API(res, GET_LIST[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** subCategory detail *********************/
    subcategory_detail: async (req, res) => {
        try {
            let data = await subcategory_detail_data(req, res)
            if (data) {
                return SUCCESS_API(res, GET_DATA[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** Setting list *********************/
    setting_list: async (req, res) => {
        try {
            let data = await setting_list_data(req, res)
            if (data) {
                return SUCCESS_API(res, GET_LIST[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** subCategory list *********************/
    post_video_list: async (req, res) => {
        try {
            let data = await post_video_list_data(req, res)
            if (data) {
                return SUCCESS_API(res, GET_LIST[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /***************Certificate Question *********************/
    certificate_question: async (req, res) => {
        try {
            let data = await certificate_question_date(req, res)
            if (data) {
                return SUCCESS_API(res, GET_LIST[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** accpet terms conditions *********************/
    accpet_cms: async (req, res) => {
        try {
            let data = await accpet_cms_data(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

}