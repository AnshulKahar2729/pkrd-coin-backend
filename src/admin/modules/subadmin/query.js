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
   
    delete:async(data)=>{
        try {
            let getData = await data.deleteOne();
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_all_and_count_include_with_pagination:async(model,whereCondition={},PAGE_SIZE,page,sort)=>{
        try {
            let recordsTotal = await models[model].countDocuments(whereCondition);
            let skip = (page - 1) * PAGE_SIZE;
            let data = await models[model].find(whereCondition).limit(parseInt(PAGE_SIZE)).skip(skip).sort({_id : sort});
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