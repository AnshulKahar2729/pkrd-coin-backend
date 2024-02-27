'use strict';

const models = require('../../../../models/index')

module.exports = {
    find_one: async (model, whereCondition = {}) => {
        try {
            let getData = await models[model].findOne(whereCondition)
            console.log(getData, "-------")
            return getData;
        } catch (err) {
            throw err;
        }
    },


    find_one_with_populate: async (model, whereCondition = {}, includeModule = {}) => {
        try {
            let getData = await models[model].findOne(whereCondition).populate(includeModule.main_id, includeModule.values);
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_one_with_populates: async (model, whereCondition = {}, includeModule = {}, includeModules = {}) => {
        try {
            let getData = await models[model].findOne(whereCondition).populate(includeModule.main_id).populate(includeModules.main_id, includeModules.values)
            return getData;
        } catch (err) {
            throw err;
        }
    },


    update_one: async (model, whereCondition = {}, addField = {}) => {
        try {
            let createData = await models[model].updateOne(
                whereCondition,
                addField,
            )
            return createData;
        } catch (err) {
            return err;
        }
    },


    create: async (model, addField = {}) => {
        try {
            let createData = await models[model].create(
                addField
            )
            return createData;
        } catch (err) {
            return err;
        }
    },

    update: async (model, whereCondition = {}, updateField = {}) => {
        try {
            let updateData = await models[model].updateMany(
                whereCondition,
                updateField
            )
            return updateData;
        } catch (err) {
            return err;
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

    delete: async (data) => {
        try {
            let getData = await data.deleteOne();
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