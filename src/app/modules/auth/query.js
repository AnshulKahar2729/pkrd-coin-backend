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
            let getData = await models[model].find(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    find_one_and_update:async(model,whereCondition={},updateField={})=>{
        try {
            let updateData = await models[model].findOneAndUpdate(
                whereCondition, 
                updateField,
                {new:true, upsert:true}
            )
            return updateData;
        } catch (err) {
            throw err;
        }
    },

    
  
    aggregations:async(model, geoLocation, matchObject, lookupObject, unwindObject, addFields) =>{
        try {
            let aggregationPipeline = [];
            
            if (geoLocation) {
                aggregationPipeline.push(geoLocation);
            }
    
            if (matchObject) {
                aggregationPipeline.push({ $match: { ...matchObject } });
            }
    
            if (lookupObject) {
                aggregationPipeline.push(...lookupObject);
            }
            if (unwindObject) {
                unwindObject.forEach(field => {
                    aggregationPipeline.push({ $unwind: field });
                });
            }
    
            if (addFields) {
                aggregationPipeline.push(addFields);
            }
    
            let createData = await models[model].aggregate(aggregationPipeline);
            return createData;
        } catch (err) {
            return err;
        }
    }

}