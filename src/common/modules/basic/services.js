const mongoose = require('mongoose');
const { Types } = mongoose;

const { APP_DEFAULT_LANGUAGE, QUESTION_LIMIT, PAGE_SIZE } = require('../../../../utils/constants/app.constants');
const { NOT_FOUND } = require('../../../../utils/constants/message.constants');
const { encrypt } = require('./password');
const { CATEGORIES, SUBCATEGORIES, CERTIFICATE_QUESTIONS, ONBOARDING_SCREEN, USER } = require('../../../../utils/constants/model.constants');
const query = require('./query');
//modles
const models = require('../../../../models/index')
MODEL_NAME = 'CONTENT'
MODEL_NAME_USER = 'USERS'
MODEL_USER_DETAILS = 'USER_DETAILS'
MODEL_NAME_SETTING = 'SETTINGS'
MODEL_NAME_CATEGORIES = 'CATEGORIES'
MODEL_NAME_SUBCATEGORIES = 'SUBCATEGORIES'
MODEL_NAME_CERTIFICATE_QUESTION = 'CERTIFICATE_QUESTIONS'
MODEL_NAME_POSTS = 'POSTS'
MODEL_NAME_ONBOARDING_SCREENS = 'ONBOARDING_SCREENS'
MODEL_RANDOM_CERTIFICATE_QUESTIONS = 'RANDOM_CERTIFICATE_QUESTIONS'

module.exports = {

    /*************** PAGE EXISTS *********************/
    check_page_exists: async (req, res) => {
        try {
            let whereCondition = {
                name: req.params.name
            }
            let getData = await query.find_one(MODEL_NAME, whereCondition)
            if (getData) {
                return true
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /*************** GET PAGES *********************/
    get_page_data: async (req, res) => {
        try {
            let whereCondition = {
                name: req.params.name
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

    /*************** admin_signup *********************/
    admin_signup_data: async (role) => {
        try {
            let whereCondition = {
                role
            }
            let adminData = await query.find_one(MODEL_NAME_USER, whereCondition)
            //Hash the password
            let passwordHash = await encrypt("admin@123");
            let data = {
                username: "Admin",
                email: "admin@admin.com",
                role: 0,
                password: passwordHash,
                status: 1,
            }
            let getData;
            if (!adminData) {
                getData = await query.create(MODEL_NAME_USER, data)
                getData = await query.create(MODEL_USER_DETAILS, { user_id: getData._id })
            } else {
                getData = await query.update(MODEL_NAME_USER, { _id: adminData._id }, data)
            }
            if (getData) {
                return {};
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }

        } catch (error) {
            throw error
        }
    },

    /************************* Content Pages*****************************/
    content_page_data: async (req, res) => {
        try {
            let whereCondition = {
                name: req.body.name
            }
            let cmsData = await query.find_one(MODEL_NAME, whereCondition);
            let getData;
            if (!cmsData) {
                getData = await query.create(MODEL_NAME, req.body)
            } else {
                getData = await query.update(MODEL_NAME, { _id: cmsData._id, name: cmsData.name }, req.body)
            }

            if (getData) {
                return {};
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }

        } catch (error) {
            throw error
        }
    },

    /************************* Category list *****************************/
    category_list_data: async (req, res) => {
        try {
            let { page, limit, sort } = req.query

            let currentPage = parseInt(page ? page : 1);
            limit = parseInt(limit ? limit : PAGE_SIZE);
            sort = (req.query.sort == 0) ? 1 : -1; //0 for asc, 1 for desc

            const pipeline = [
                {
                    $match: { status: CATEGORIES.STATUS.ACTIVE }
                },
                {
                    $lookup: {
                        from: 'sub_categories',
                        localField: '_id',
                        foreignField: 'category_id',
                        as: 'subcategory_count'
                    }
                },
                {
                    $addFields: {
                        subcategory_count: { $size: '$subcategory_count' }
                    }
                },
                {
                    $project: { name: 1, _id: 1, image: 1, subcategory_count: 1 }
                }
            ];
            const getData = await query.aggregation_with_pagination(MODEL_NAME_CATEGORIES, pipeline, limit, currentPage, sort);
            // const getData = await models[MODEL_NAME_CATEGORIES].aggregate(pipelin);
            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /************************* SubCategory list *****************************/
    subcategory_list_data: async (req, res) => {
        try {
            let { id } = req.params
            const validObjectCatgeoryId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
            let { page, limit, sort } = req.query

            let currentPage = parseInt(page ? page : 1);
            limit = parseInt(limit ? limit : PAGE_SIZE);
            sort = (req.query.sort == 0) ? 1 : -1; //0 for asc, 1 for desc

            const pipeline = [
                {
                    $match: { category_id: validObjectCatgeoryId, status: SUBCATEGORIES.STATUS.ACTIVE }
                },
                {
                    $lookup: {
                        from: "categories",
                        let: {
                            categoryId: "$category_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$categoryId"]
                                    }
                                }
                            },
                            {
                                $project: { _id: 1, name: 1, image: 1 }
                            }
                        ],
                        as: "category_id"
                    }
                },
                { $unwind: { path: "$category_id", preserveNullAndEmptyArrays: true } },
            ];
            const getData = await query.aggregation_with_pagination(MODEL_NAME_SUBCATEGORIES, pipeline, limit, currentPage, sort);
            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /************************* post video data *****************************/
    post_video_list_data: async (req, res) => {
        try {
            let { page, limit, sort } = req.query
            const { category_id, subcategory_id } = req.params
            const validObjectCatgeoryId = mongoose.Types.ObjectId.isValid(category_id) ? new mongoose.Types.ObjectId(category_id) : null;
            const validObjectSubcategoryId = mongoose.Types.ObjectId.isValid(subcategory_id) ? new mongoose.Types.ObjectId(subcategory_id) : null;

            let currentPage = parseInt(page ? page : 1);
            limit = parseInt(limit ? limit : PAGE_SIZE);
            sort = (req.query.sort == 0) ? 1 : -1; //0 for asc, 1 for desc
            const pipeline = [
                {
                    $match: {
                        category_id: validObjectCatgeoryId,
                        subcategory_id: validObjectSubcategoryId
                    }
                },
            ]
            const getData = await query.aggregation_with_pagination(MODEL_NAME_POSTS, pipeline, limit, currentPage, sort);
            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /************************* Setting list *****************************/
    setting_list_data: async (req, res) => {
        try {
            let { type } = req.query
            let whereCondition = {
                ...(req.query.type ? { type } : {}) //0 - radius , 1 - loyalty point, 2 - duration, 3- admin commission, 4- canncel fee , 5 - tax
            }

            getData = await query.find_all(MODEL_NAME_SETTING, whereCondition);
            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /************************* Certificate Question  *****************************/
    certificate_question_date: async (req, res) => {
        try {

            let { category_id, subcategory_id } = req.params

            let whereCondition = {
                user_id: req.user._id,
                category_id: new Types.ObjectId(category_id),
                subcategory_id: new Types.ObjectId(subcategory_id),
            }
            //get random old quesrtion 
            let get_old_question = await query.find_all(MODEL_RANDOM_CERTIFICATE_QUESTIONS, whereCondition);
            let QuestionIdArray = []
            if (get_old_question.length > 0) {
                for (let data of get_old_question) {
                    QuestionIdArray.push(data.certficate_id)
                }
            }
            //suffle with randome 20 number
            const pipeline = [
                {
                    $match: {
                        status: CERTIFICATE_QUESTIONS.STATUS.ACTIVE,
                        category_id: new Types.ObjectId(category_id),
                        subcategory_id: new Types.ObjectId(subcategory_id),
                        ...(QuestionIdArray.length > 0 ? { _id: { $in: QuestionIdArray } } : {})
                    }
                },
                { $sample: { size: QUESTION_LIMIT } }
            ]

            let getData = await models[MODEL_NAME_CERTIFICATE_QUESTION].aggregate(pipeline);

            if (getData) {
                for (let val of getData) {
                    let obj = {
                        user_id: req.user._id,
                        certficate_id: val._id,
                        category_id,
                        subcategory_id,
                    }
                    await query.find_one_and_update(MODEL_RANDOM_CERTIFICATE_QUESTIONS, obj, obj)
                }
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },


    /************************* onboarding screen  list *****************************/
    onboarding_screen_data: async (req, res) => {
        try {
            let whereCondition = {
                status: ONBOARDING_SCREEN.STATUS.ACTIVE,
                ...(req.query.type ? { screen_type: parseInt(req.query.type) } : {})
            }

            let getData = await query.find_all_priority(MODEL_NAME_ONBOARDING_SCREENS, whereCondition);
            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /************************* subcategory detail  *****************************/
    subcategory_detail_data: async (req, res) => {
        try {
            const { id } = req.params
            let whereCondition = { _id: id }

            let getData = await query.find_one(MODEL_NAME_SUBCATEGORIES, whereCondition);
            if (getData) {
                return getData
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }
        } catch (error) {
            throw error
        }
    },

    /************************* accpet terms conditions *****************************/
    accpet_cms_data: async (req, res) => {
        try {
            let whereCondition = {
                _id: req.body.user_id
            }
            let userInfo = await query.find_one(MODEL_NAME_USER, whereCondition)
            if (userInfo) {
                let updateField = {
                    'is_accepted_terms': userInfo.is_accepted_terms == USER.IS_ACCEPTED_TERMS.YES ? USER.IS_ACCEPTED_TERMS.NO : USER.IS_ACCEPTED_TERMS.YES
                }
                await query.update(MODEL_NAME_USER, whereCondition, updateField)
                return {};
            } else {
                throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE])
            }

        } catch (error) {
            throw error
        }
    },
}