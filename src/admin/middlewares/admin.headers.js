const { Validator } = require('node-input-validator');
const helper = require('../modules/auth/helper');
const { FAILED_API } = require('../../../utils/return.response');
const { ENC_SECRET_KEY, ENC_PUBLISH_KEY, APP_DEFAULT_LANGUAGE } = require('../../../utils/constants/app.constants');
const { HEADER_DATA_NOT_VALID, HEADER_SECRET_DATA_NOT_VALID } = require('../../../utils/constants/message.constants');

module.exports = {
    authenticateHeader: async function (req, res, next) {
        console.log('--------in header check------------')
        const v = new Validator(req.headers, {
            secretkey: 'required|string',
            publishkey: 'required|string'
        });

        let errorsResponse = await helper.checkValidation(v)

        if(errorsResponse){
            return FAILED_API(res, HEADER_DATA_NOT_VALID[APP_DEFAULT_LANGUAGE])
        }

        if((req.headers.secretkey !== ENC_SECRET_KEY) || (req.headers.publishkey !== ENC_PUBLISH_KEY)){
            return FAILED_API(res, HEADER_SECRET_DATA_NOT_VALID[APP_DEFAULT_LANGUAGE])
        }
        next();
    }
}