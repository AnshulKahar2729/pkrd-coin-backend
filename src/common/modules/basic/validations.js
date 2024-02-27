const { Validator } = require('node-input-validator');
const helper = require('./helper');
const { SUCCESS_API, FAILED_API } = require('../../../../utils/return.response');
const { HEADER_DATA_NOT_VALID } = require('../../../../utils/constants/message.constants');
const { APP_DEFAULT_LANGUAGE } = require('../../../../utils/constants/app.constants');

module.exports = {
    encryptionForSkPk: async function (req, res, next) {
        console.log('--------in header check------------')
        console.log(req.headers, '--------in header check------------')
        const v = new Validator(req.headers, {
            secret_key: 'required|string',
            publish_key: 'required|string'
        });
     
        let errorsResponse = await helper.checkValidation(v)
       

        if (errorsResponse) {
            return FAILED_API(res, HEADER_DATA_NOT_VALID[APP_DEFAULT_LANGUAGE])
        }
        next();
    },

    page: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.params, {
            name: 'required|in:ABOUT_US,TERMS_CONDITIONS,TERMS_CONDITIONS',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    accpet_cms: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            user_id: 'required',
            status: 'required|in:0,1',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    upload_image: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.files, {
            file: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    delete_image: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            file: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    content_page: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            name: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    subcategory_list: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.params, {
            id: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    subcategory_detail: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.params, {
            id: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    post_videos: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.params, {
            category_id: 'required',
            subcategory_id: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    add_week_days: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            day: 'required'
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },


}