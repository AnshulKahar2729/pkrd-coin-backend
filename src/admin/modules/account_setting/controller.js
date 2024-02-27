const {  add_data, get_list } = require('./services');
const { APP_DEFAULT_LANGUAGE } = require('../../../../utils/constants/app.constants');
const { GET_LIST, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } = require('../../../../utils/constants/message.constants');
const { SUCCESS_API, FAILED_API } = require('../../../../utils/return.response');

module.exports = {

    /*************** get list  *********************/
    list: async (req, res) => {
        try {
            let data = await get_list(req, res)
            if(data){
                return SUCCESS_API(res, GET_LIST[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

   /*************** add  *********************/
    add: async (req, res) => {
        try {
            let data = await add_data(req, res)
            if(data){
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

}