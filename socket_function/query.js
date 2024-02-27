'use strict';

const models = require('../models/index');
const moment = require('moment');

module.exports = {
    find_one:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].findOne(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    update_one:async(model, whereCondition={}, addField={})=>{
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

    findOneAndUpdate:async(model,whereCondition={},updateField={})=>{
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

    create:async(model,addField={})=>{
        try {
            let createData = await models[model].create(
                addField
            )
            return createData;
        } catch (err) {
            throw err;
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

    find_all:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].find(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    current_time_date: async () => {
        try {
            const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            return currentDateTime;
        } catch (err){
            console.log(err,'-----err in otp------------')
        }
    },
    

}