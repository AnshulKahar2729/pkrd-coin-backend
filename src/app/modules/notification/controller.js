const { get_list_pagination, add_data, edit_data, get_data_by_id, read_notification } = require('./services');
const { APP_DEFAULT_LANGUAGE } = require('../../../../utils/constants/app.constants');
const { GET_LIST, SOMETHING_WENT_WRONG, GET_DATA, UPDATE_STATUS, DELETE_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS } = require('../../../../utils/constants/message.constants');
const { SUCCESS_API, FAILED_API } = require('../../../../utils/return.response');

module.exports = {
    /*************** list *********************/
    list: async (req, res) => {
        try {
            let data = await get_list_pagination(req, res)
            if (data) {
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
            if (data) {
                return SUCCESS_API(res, CREATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** edit  *********************/
    edit: async (req, res) => {
        try {
            let data = await edit_data(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** read Notification  *********************/
    read_notification: async (req, res) => {
        try {
            let data = await read_notification(req, res)
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