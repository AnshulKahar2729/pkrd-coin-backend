const mongoose = require('mongoose');
const { Types } = mongoose;

const { APP_DEFAULT_LANGUAGE, PAGE_SIZE } = require('../../../../utils/constants/app.constants');
const { SOMETHING_WENT_WRONG, NOT_FOUND, ALREADY_EXISTS_QUESTION } = require('../../../../utils/constants/message.constants');
const { SUBSCRIPTION_PLANS } = require('../../../../utils/constants/model.constants');
const query = require('./query');
const { unixTimestamp } = require('./helper');
//models
const MODEL_NAME = 'EXCHANGE'

module.exports = {

    /*************** get list with pagination *********************/
    get_list_pagination: async (req, res) => {
        try {
            let { page, limit, search_string, sort, activeStatus, search_date } = req.query
            let search_data = search_string ? search_string : '';
            sort = (req.query.sort == 0) ? 1 : -1; //0 for asc, 1 for desc
            let currentPage = parseInt(page ? page : 1);
            limit = parseInt(limit ? limit : PAGE_SIZE);
            //search by date
            let searchByDate = {}
            if (search_date) {
                searchByDate = {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            search_date
                        ]
                    }
                }
            }

            let whereCondition = {
                user_id: req.user?._id
            }

            let includeModule = {
                main_id: 'user_id user_id',
                values: 'username email'
            }

            let getData = []
            if (req.query.search_string || search_data != '' || search_date) {
                whereCondition = {
                    ...(search_date ? searchByDate : {}),
                }
                getData = await query.find_all_and_count_with_populate_include_with_pagination(MODEL_NAME, whereCondition, includeModule, limit, currentPage, sort);
            } else {
                getData = await query.find_all_and_count_with_populate_include_with_pagination(MODEL_NAME, whereCondition, includeModule, limit, currentPage, sort);
            }

            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** add  *********************/
    add_data: async (req, res) => {
        try {
            req.body.user_id = req.user?._id
            let createData = await query.create(MODEL_NAME, req.body)
            if (createData) {
                return createData;
            } else {
                throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** update  *********************/
    update_status: async (req, res) => {
        try {
            let { id, status } = req.body
            let whereCondition = {
                _id: id
            }

            // Update the document with fields other than intervals
            await query.update(MODEL_NAME, whereCondition, { status: status });
            return {}
        } catch (error) {
            throw error
        }
    },


}