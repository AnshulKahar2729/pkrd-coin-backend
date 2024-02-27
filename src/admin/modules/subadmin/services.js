const { APP_DEFAULT_LANGUAGE, PAGE_SIZE } = require('../../../../utils/constants/app.constants');
const { SOMETHING_WENT_WRONG, NOT_FOUND, ALREADY_EXISTS } = require('../../../../utils/constants/message.constants');
const { USER  } = require('../../../../utils/constants/model.constants');
const { encrypt } = require('./password');
const query = require('./query');
//models
const MODEL_NAME = 'USERS'

module.exports = {
    
   /*************** get list with pagination *********************/
    get_list_pagination: async (req, res) => {
        try {
            let { page, limit, search_string, sort } = req.query
            let search_data = search_string ? search_string : '';
            sort = (req.query.sort == 0) ? 1 : -1 ; //0 for asc, 1 for desc
            let currentPage = parseInt(page ? page : 1);
            limit = parseInt(limit ? limit : PAGE_SIZE);
            let whereCondition = {
                    
            }
            let getData = []
            if(req.query.search_string && search_data != ''){
                whereCondition = {
                    $or: [ { username : { $regex: new RegExp(search_data, "i") } },{ last_name : { $regex: new RegExp(search_data, "i") } },{ email : { $regex: new RegExp(search_data, "i") } },  ],
                    role:USER.ROLE.SUBADMIN
                }
                getData = await query.find_all_and_count_include_with_pagination(MODEL_NAME, whereCondition, limit, currentPage, sort);
            }else{
                whereCondition = {
                    role:USER.ROLE.SUBADMIN
                }
                getData = await query.find_all_and_count_include_with_pagination(MODEL_NAME, whereCondition, limit, currentPage, sort);
            }

            return getData
        } catch (error) {
            throw error
        }
    },

   /*************** add  *********************/
    add_data: async (req, res) => {
        try {
            req.body.role = USER.ROLE.SUBADMIN
            if (req.body.password) {
                req.body.password = await encrypt(req.body.password)
            }
            //permissions
            let permissionArr = [];
            if(req.body.permissions){
                for(let val of JSON.parse(req.body.permissions)){
                    permissionArr.push(val)
                }
                console.log(permissionArr)
                req.body.permissions = permissionArr
            }
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

   /*************** update *********************/
    edit_data: async (req, res) => {
        try {
            await module.exports.check_edit_exists(req, res)
            let { id } = req.body
            let whereCondition = {
                _id : id
            }
            if (req.body.is_password_changed==='true') {
                req.body.password = await encrypt(req.body.password)
            }
              //permissions
            let permissionArr = [];
            if(req.body.permissions){
                for(let val of JSON.parse(req.body.permissions)){
                    permissionArr.push(val)
                }
                req.body.permissions = permissionArr
            }
            await query.update(MODEL_NAME, whereCondition, req.body)
            return {}
        } catch (error) {
            throw error
        }
    },

    /*************** check exist data *********************/
    check_exists_data: async (req, res) => {
        try {
            const { email } = req.body
            let whereCondition = {
                email,
            }
            let checkData = await query.find_one(MODEL_NAME, whereCondition)

            if (checkData) {
                throw new Error(ALREADY_EXISTS[APP_DEFAULT_LANGUAGE])
            } else {
                return checkData
            }
        } catch (error) {
            throw error
        }
    },

    /*************** check exist name update case *********************/

    check_data_exists: async (req, res) => {
        try {
            const { id } = req.body
            let whereCondition = {
                _id : id
            }
            let checkData = await query.find_one(MODEL_NAME, whereCondition)
            if (checkData) {
                return checkData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    check_edit_exists: async (req, res) => {
        try {
            let data = await module.exports.check_data_exists(req, res)

            const { email } = req.body
            let whereCondition = {
                email,
                _id:{
                    $ne : data._id
                }
            }
            let checkData = await query.find_one(MODEL_NAME, whereCondition)

            if (checkData) {
                throw new Error(ALREADY_EXISTS[APP_DEFAULT_LANGUAGE])
            } else {
                return checkData
            }
        } catch (error) {
            throw error
        }
    },

    /*************** get data by id*********************/
    get_data_by_id: async (req, res) => {
        try {
            let { id } = req.params
            let whereCondition = {
                _id:id
            }

            let getData = await query.find_one(MODEL_NAME, whereCondition)
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
                _id:id
            }
            let getData = await query.find_one(MODEL_NAME,whereCondition)
            if (getData) {
                let updateStatus = {
                    'status' : getData.status == USER.STATUS.ACTIVE ? USER.STATUS.INACTIVE : USER.STATUS.ACTIVE
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
                _id:id
            }
            let getData = await query.find_one(MODEL_NAME,whereCondition)
            if (getData) {
                await query.delete(getData)
                return {}
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    

   
}