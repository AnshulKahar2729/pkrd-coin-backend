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

    find_all_count:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].countDocuments(whereCondition)
            return getData;
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
   
    delete:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].remove(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },
}