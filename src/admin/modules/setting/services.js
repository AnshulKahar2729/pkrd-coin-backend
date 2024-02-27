const { APP_DEFAULT_LANGUAGE, PAGE_SIZE } = require('../../../../utils/constants/app.constants');
const { SOMETHING_WENT_WRONG, NOT_FOUND, NAME_EXISTS, VALUE_EXISTS } = require('../../../../utils/constants/message.constants');
const helper = require('./helper');
const { SETTING } = require('../../../../utils/constants/model.constants');
const query = require('./query');
//models
const MODEL_NAME = 'SETTINGS'

module.exports = {

    /*************** update *********************/
    edit_data: async (req, res) => {
        try {
            let setting = await query.find_one(MODEL_NAME);

            if (!setting) {
                setting = await query.create(MODEL_NAME, req.body)
            } else {
                setting = await query.find_one_and_update(MODEL_NAME, req.body)
            }
            return setting;
        } catch (error) {
            throw error
        }
    },

}