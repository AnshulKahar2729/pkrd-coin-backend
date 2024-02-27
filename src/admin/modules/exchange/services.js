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

    /*************** update  *********************/
    edit_data: async (req, res) => {
        try {
            let { id } = req.body
            let whereCondition = {
                _id: id
            }

            const intervalsData = req.body.intervals;
            delete req.body.intervals;

            // Update the document with fields other than intervals
            await query.update(MODEL_NAME, whereCondition, req.body);

            // Check if intervalsData is provided
            if (intervalsData && intervalsData.length > 0) {
                for (const interval of intervalsData) {
                    const { type, price, duration, status, _id } = interval;

                    // Check if an interval with the same type exists
                    const existingInterval = await query.find_one(MODEL_NAME, {
                        _id: id,
                        'intervals.type': type,
                    });

                    if (existingInterval) {
                        // Update the existing interval with the provided data
                        await query.update(
                            MODEL_NAME,
                            {
                                _id: id,
                                'intervals.type': type,
                            },
                            {
                                $set: {
                                    'intervals.$.price': price,
                                    'intervals.$.duration': duration,
                                    'intervals.$.status': status,
                                    // Add other fields you want to update here
                                },
                            }
                        );
                    } else {
                        // Create a new interval if the type doesn't exist
                        await query.update(
                            MODEL_NAME,
                            whereCondition,
                            {
                                $push: {
                                    intervals: interval,
                                },
                            }
                        );
                    }
                }
            }

            return {}
        } catch (error) {
            throw error
        }
    },


    /*************** get data by id*********************/
    get_data_by_id: async (req, res) => {
        try {
            let { id } = req.params
            let whereCondition = {
                _id: id
            }
            let includeModule = {

            }

            let includeModules = {
            }

            let getData = await query.find_one_with_populates(MODEL_NAME, whereCondition, includeModule, includeModules)

            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** update status*********************/
    update_data_status: async (req, res) => {
        try {
            let { id } = req.params
            let whereCondition = {
                _id: id
            }
            let getData = await query.find_one(MODEL_NAME, whereCondition);
            // console.log(getData, "getData");
            if (getData) {
                let updateStatus = {
                    'status': getData.status == SUBSCRIPTION_PLANS.STATUS.ACTIVE ? SUBSCRIPTION_PLANS.STATUS.INACTIVE : SUBSCRIPTION_PLANS.STATUS.ACTIVE
                }
                await query.update(MODEL_NAME, whereCondition, updateStatus)
                return {}
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** delete *********************/
    delete_data: async (req, res) => {
        try {
            let { id } = req.params
            let whereCondition = {
                _id: id
            }
            let getData = await query.find_one(MODEL_NAME, whereCondition)
            if (getData) {
                await query.delete(getData)
                return {}
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    }
}