const { get_list_pagination, add_data, edit_data, get_data_by_id, update_data_status, delete_data, import_csv_data, affliate_code } = require('./services');
const { APP_DEFAULT_LANGUAGE } = require('../../../../utils/constants/app.constants');
const { GET_LIST, SOMETHING_WENT_WRONG, GET_DATA, UPDATE_STATUS, DELETE_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS } = require('../../../../utils/constants/message.constants');
const { SUCCESS_API, FAILED_API } = require('../../../../utils/return.response');

module.exports = {
    /*************** list *********************/
    list: async (req, res) => {
        console.log("userListController");
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

    /*************** edit *********************/
    edit: async (req, res) => {
        console.log('userEditValidation');

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

    /*************** view *********************/
    view: async (req, res) => {
        console.log('userViewController');

        try {
            let data = await get_data_by_id(req, res)
            if (data) {
                return SUCCESS_API(res, GET_DATA[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (err) {
            return FAILED_API(res, err);
        }
    },

    /*************** update *********************/
    update_status: async (req, res) => {
        try {
            let data = await update_data_status(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_STATUS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** delete *********************/
    delete: async (req, res) => {
        try {
            let data = await delete_data(req, res)
            if (data) {
                return SUCCESS_API(res, DELETE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** import csv *********************/
    import_csv: async (req, res) => {
        try {
            let data = await import_csv_data(req, res)
            if (data) {
                return SUCCESS_API(res, UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

    /*************** affliate code generate *********************/
    affliate_code: async (req, res) => {
        try {
            let data = await affliate_code(req, res)
            if (data) {
                return SUCCESS_API(res, GET_DATA[APP_DEFAULT_LANGUAGE], data)
            } else {
                return FAILED_API(res, SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            return FAILED_API(res, error)
        }
    },

}