const { Validator } = require('node-input-validator');
const helper = require('./helper')
const { FAILED_API } = require('../../../../utils/return.response');
const { USER } = require('../../../../utils/constants/model.constants');

module.exports = {

    add: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            ip_address : 'required',
            location : 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    edit: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            id: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    view: async function (req, res, next) {
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

    delete: async function (req, res, next) {
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

}