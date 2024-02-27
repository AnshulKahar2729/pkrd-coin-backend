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

    find_one_and_update:async(model,addField={}, whereCondition={})=>{
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
}