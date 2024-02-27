const {  add_data, get_data_by_id, update_data_status, delete_data, get_list, edit_data } = require('./services');
const { APP_DEFAULT_LANGUAGE } = require('../../../../utils/constants/app.constants');
const { GET_LIST, SOMETHING_WENT_WRONG, GET_DATA, UPDATE_STATUS, DELETE_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS } = require('../../../../utils/constants/message.constants');
const { SUCCESS_API, FAILED_API } = require('../../../../utils/return.response');

module.exports = {

    /*************** changeSetting *********************/
    changeSetting: async (req, res) => {
        try {
            let data = await edit_data(req, res)
            if(data){
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    }
}