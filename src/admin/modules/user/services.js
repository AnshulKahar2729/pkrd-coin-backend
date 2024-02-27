const { APP_DEFAULT_LANGUAGE, PAGE_SIZE } = require('../../../../utils/constants/app.constants');
const { SOMETHING_WENT_WRONG, NOT_FOUND, ALREADY_EXISTS } = require('../../../../utils/constants/message.constants');
const { USER } = require('../../../../utils/constants/model.constants');
const query = require('./query');
const { encrypt } = require('./password');
const helper = require('./helper');
//models
const MODEL_NAME = 'USERS'
const MODEL_NAME_KYC = 'KYC';

module.exports = {

    /*************** get list with pagination *********************/
    get_list_pagination: async (req, res) => {
        console.log("userServiceController");

        try {
            let { page, limit, search_string, sort, role, activeStatus } = req.query;

            let search_data = search_string ? search_string : '';
            sort = (req.query.sort == 0) ? 1 : -1; //0 for asc, 1 for desc
            let currentPage = parseInt(page ? page : 1);
            limit = parseInt(limit ? limit : PAGE_SIZE);
            let whereCondition = {
            }

            let getData = []
            if (req.query.search_string && search_data != '') {
                whereCondition = {
                    role: role,
                    ...(activeStatus != 2 ? { status: activeStatus } : {}),
                    $or: [{ username: { $regex: new RegExp(search_data, "i") } }, { last_name: { $regex: new RegExp(search_data, "i") } }, { email: { $regex: new RegExp(search_data, "i") } }]
                }
                getData = await query.find_all_and_count_include_with_pagination(MODEL_NAME, whereCondition, limit, currentPage, sort);
            } else {
                whereCondition = {
                    role: role,
                    ...(activeStatus != 2 ? { status: activeStatus } : {})
                }
                getData = await query.find_all_and_count_include_with_pagination(MODEL_NAME, whereCondition, limit, currentPage, sort);
            }

            if (getData) {
                return getData
            } else {
                return
            }
        } catch (error) {
            throw error
        }
    },

    /*************** add  *********************/
    add_data: async (req, res) => {
        try {
            await module.exports.check_name_exists(req, res)
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
    edit_data: async (req, res) => {
        try {
            let exitsUser = await module.exports.check_data_exists(req, res)
            let whereCondition = {
                _id: exitsUser._id
            }
            if (req.body.is_password_changed === 'true') {
                req.body.password = await encrypt(req.body.password)
            }

            if (req.body.is_otp_verified === '1') {
                req.body.is_phone_verified = USER.IS_PHONE_VERIFIED.YES
            }

            await query.update(MODEL_NAME, whereCondition, req.body);
            exitsUser = await module.exports.check_data_exists(req, res);

            return exitsUser;
        } catch (error) {
            throw error
        }
    },

    /*************** check exist name *********************/
    check_name_exists: async (req, res) => {
        try {
            const { username, last_name } = req.body
            let whereCondition = {
                username,
                last_name,
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
                _id: id
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

    check_edit_name_exists: async (req, res) => {
        try {
            let data = await module.exports.check_data_exists(req, res)
            let whereCondition = {
                email: data.email,
                _id: data._id
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
        console.log("userService");
        try {
            let { id } = req.params
            let whereCondition = {
                _id: id
            }
            let getData = await query.find_one(MODEL_NAME, whereCondition)
            if (!getData) {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
            }

            return getData;
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
            let getData = await query.find_one(MODEL_NAME, whereCondition)
            if (getData) {
                let updateStatus = {
                    'status': getData.status == USER.STATUS.ACTIVE ? USER.STATUS.INACTIVE : USER.STATUS.ACTIVE
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
            const { id } = req.body;
            let whereCondition;
            let getData = await query.find_one(MODEL_NAME, { _id: id });
            console.log(getData, "getData");
            if (getData) {
                await query.delete(getData);
                whereCondition = {
                    $or: [
                        { user_id: getData._id },
                        { provider_id: getData._id },
                        { send_to: getData._id },
                        { send_by: getData._id },
                        { added_by: getData._id },
                        { rated_to: getData._id },
                        { rated_by: getData._id },
                        { reported_by: getData._id },
                        { reported_to: getData._id },
                    ]
                }
                await helper.delete_relational_data(whereCondition)
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
            return {}
        } catch (error) {
            throw error
        }
    },

    /*************** import csv *********************/
    import_csv_data: async (req, res) => {
        try {
            const filePath = req.files;
            if (!req.files || !req.files.path) {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }

            let results = await helper.import_csv_file(filePath?.path?.tempFilePath)
            if (results && results.length > 0) {
                for (let res of results) {
                    const firstNameKey = Object.keys(res).find(key => key.trim() === '"First Name"');
                    const firstName = firstNameKey ? res[firstNameKey] : undefined;
                    let obj = {
                        username: firstName ? firstName : res['First Name'],
                        last_name: res['Last Name'],
                        phone: res['Phone'],
                        country_code: res['Country Code'],
                        full_phone_number: res['Full Phone Number'],
                        email: res['Email'],
                        role: res['Role'] === 'Customer' ? 2 : res['Role'] === 'Provider' ? 3 : 2,
                        image: res['Image'],
                        bio: res['Bio'],
                        address: res['Address'],
                        dob: res['DOB'],
                        gender: res['Gender'] === 'Male' ? 1 : res['Gender'] === 'Female' ? 2 : 0,
                    }
                    let whereCondition = {
                        $or: [
                            { email: obj.email },
                            { full_phone_number: obj.full_phone_number }
                        ]
                    }

                    let getData = await query.find_one(MODEL_NAME, whereCondition)
                    if (getData) {
                        await query.update(MODEL_NAME, whereCondition, obj)
                    } else {
                        let time = helper.unixTimestamp();
                        obj.login_time = time;
                        await query.create(MODEL_NAME, obj)
                    }
                }
                return {}
            } else {
                throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },


    /*************** update status*********************/
    affliate_code: async (req, res) => {
        try {
            let { id } = req.body
            let whereCondition = {
                _id: id
            }
            let getData = await query.find_one(MODEL_NAME, whereCondition);
            if (getData.affliate_details.length <= 0) {
                // generate affliate code with username and userid mixture
                const username = getData.username; // Replace 'username' with the actual field name
                const userId = getData._id; // Assuming '_id' is the user ID field

                let generatedCode = `${username}${userId}`; // You can customize the format

                // Check if the generated code already exists in your database
                const existingCode = await query.find_one(MODEL_NAME, { 'affliate_details.affliate_code': generatedCode });

                if (existingCode) {
                    // If the code already exists, you can modify it to make it unique
                    generatedCode = `${generatedCode}-1`; // Modify as needed for uniqueness
                }

                // Store the generated affiliate code in your user's data
                getData.affliate_details.push({
                    affliate_code: generatedCode,
                });

                // Save the updated user data back to the database
                await getData.save();
            }
            return getData.affliate_details;

        } catch (error) {
            throw error
        }
    },

}