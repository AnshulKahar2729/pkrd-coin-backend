const { Validator } = require('node-input-validator');
const helper = require('./helper')
const { FAILED_API } = require('../../../../utils/return.response');
const { USER } = require('../../../../utils/constants/model.constants');

module.exports = {
    login: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            type: 'required|in:0,1',
            password: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return response.failed(res, errorsResponse)
        }
        next();
        if (req.body.type == 0) {
            let v2 = new Validator(req.body, {
                email: 'required|email',
            });
            let errorsResponse2 = await helper.checkValidation(v2);

            if (errorsResponse2) {
                return FAILED_API(res, errorsResponse2)
            }
        }
        if (req.body.type == 1) {
            let v3 = new Validator(req.body, {
                phone: 'required',
                country_code: 'required',
            });
            let errorsResponse3 = await helper.checkValidation(v3);

            if (errorsResponse3) {
                return FAILED_API(res, errorsResponse3)
            }
        }
    },
    edit_profile: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            username: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    change_password: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            old_password: 'required',
            new_password: 'required|different:old_password',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    forgot_password: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            email: 'required|email',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },
    reset_password_form: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.params, {
            token: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },
    reset_password: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            new_password: 'required',
            confirm_password: 'required',
            reset_token: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },


}