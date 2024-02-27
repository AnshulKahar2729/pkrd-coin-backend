'use strict';

const models = require('../../../../models/index')

module.exports = {
    find_one: async (model, whereCondition = {}) => {
        try {
            let getData = await models[model].findOne(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_all: async (model, whereCondition = {}) => {
        try {
            let getData = await models[model].find(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_all_and_count_with_populate_include_with_pagination: async (model, whereCondition = {}, includeModule = {}, PAGE_SIZE, page, sort) => {
        try {
            let recordsTotal = await models[model].countDocuments(whereCondition);
            let skip = (page - 1) * PAGE_SIZE;
            let data = await models[model].find(whereCondition).populate(includeModule.main_id, includeModule.values).limit(parseInt(PAGE_SIZE)).skip(skip).sort({ _id: sort });

            let finalObj = {
                total_pages: Math.ceil(recordsTotal / PAGE_SIZE),
                total_count: recordsTotal,
                current_page: page,
                per_page: PAGE_SIZE,
                data: data
            }

            return finalObj;
        } catch (err) {
            throw err;
        }
    },

    find_all_and_count_with_populate_include_with_pagination_search: async (model, whereCondition = {}, includeModule = {}, PAGE_SIZE, page, sort, Regex = {}) => {
        try {
            let recordsTotal = await models[model].countDocuments(whereCondition);
            let data = await models[model].find(whereCondition).populate(includeModule.main_id, includeModule.values
            ).limit(parseInt(PAGE_SIZE)).skip((page - 1)).sort({ _id: sort });

            let finalObj = {
                total_pages: Math.ceil(recordsTotal / PAGE_SIZE),
                total_count: recordsTotal,
                current_page: page,
                per_page: PAGE_SIZE,
                data: data
            }

            return finalObj;
        } catch (err) {
            throw err;
        }
    },

    aggregation: async (model, pipeline) => {
        try {
            let data = await models[model].aggregate(pipeline);
            return data;
        } catch (err) {
            throw err;
        }
    },
}