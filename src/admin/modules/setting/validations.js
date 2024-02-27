const { Validator } = require('node-input-validator');
const helper = require('./helper')
const { FAILED_API } = require('../../../../utils/return.response');
const { USER } = require('../../../../utils/constants/model.constants');

module.exports = {    
    changeSetting: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator( req.body, {
        });
        let errorsResponse = await helper.checkValidation(v)

        if(errorsResponse){
            return FAILED_API(res, errorsResponse)
        }
        next();
    }

}