'use strict';

const models = require('../../../../models/index')

module.exports = {
    find_one:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].findOne(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    create:async(model,addField={})=>{
        try {
            let createData = await models[model].create(
                addField
            )
            return createData;
        } catch (err) {
            return err;
        }
    },

    update:async(model,whereCondition={},updateField={})=>{
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

    find_all:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].find(whereCondition).sort({_id:1})
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_all_priority:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].find(whereCondition).sort({priority:1})
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_one_includes:async(model,whereCondition={}, includeModule)=>{
        try {
            let getData = await models[model].findOne(whereCondition, includeModule)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_all_include_with_populate:async(model,whereCondition={}, includeModule={}, includeModules)=>{
        try {
            let getData = await models[model].find(whereCondition, includeModule).populate(includeModules.main_id, includeModules.values)
            return getData;
        } catch (err) {
            throw err;
        }
    },
    
    find_one_and_update:async(model, whereCondition={}, addField={})=>{
        try {
            let createData = await models[model].findOneAndUpdate(
                whereCondition,
                addField,
                {upsert:true, new:true}
            )
            return createData;
        } catch (err) {
            return err;
        }
    },

    aggregation_with_pagination:async(model, pipeline, PAGE_SIZE, page, sort)=>{
        try {
            let recordsTotal = await models[model].countDocuments(pipeline[0].$match);
            let skipDocuments = (page - 1) * PAGE_SIZE;

            pipeline.push({ $skip: skipDocuments });
            pipeline.push({ $limit: PAGE_SIZE });

            const data = await models[model].aggregate(pipeline).sort({_id:sort});

            let finalObj = {
                total_pages: Math.ceil(recordsTotal / PAGE_SIZE),
                total_count:recordsTotal,
                current_page:page,
                per_page:PAGE_SIZE,
                data : data
            }

            return finalObj;
        } catch (err) {
            throw err;
        }
    },
}