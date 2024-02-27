const query = require('./query');
//models
const MODEL_NAME = 'ACCOUNT_SETTINGS'

module.exports = {
    
   /*************** get list  *********************/
    get_list: async (req, res) => {
        try {
            let whereCondition = {}
            let getData = await query.find_one(MODEL_NAME, whereCondition);
            if (getData) {
                return getData
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    },

    /*************** add update *********************/
    add_data: async (req, res) => {
        try {
            const { finalObject } = req.body;
            let get_detail = await query.find_one(MODEL_NAME);
            let final_obj = {}
            req.body.finalObject = JSON.parse(finalObject)
            if(req.body.finalObject){
                final_obj.stripe = req.body.finalObject.stripe
                final_obj.twillio = req.body.finalObject.twillio
                final_obj.mailgun = req.body.finalObject.mailgun
                final_obj.aws = req.body.finalObject.aws
            }
            if(!get_detail){
                await query.create(MODEL_NAME, final_obj) 
            }else{
                await query.update(MODEL_NAME, {_id : get_detail._id}, final_obj) 
            }
           return {}
        } catch (error) {
           throw error
        }
    },

}