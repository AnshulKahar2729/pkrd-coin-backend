
const fs = require('fs');
const csv = require('csv-parser');
const models = require('../../../../models/index')

module.exports = {
    checkValidation: async (v) => {
        var errorsResponse
        await v.check().then(function (matched) {
            if (!matched) {
                var valdErrors=v.errors;
                var respErrors=[];
                Object.keys(valdErrors).forEach(function(key) {
                    if(valdErrors && valdErrors[key] && valdErrors[key].message){
                        respErrors.push(valdErrors[key].message);
                    }
                });   
                // errorsResponse=respErrors.join(', ');
                errorsResponse=respErrors.length > 0 ? respErrors[0] : '';
            }
        });
        return errorsResponse;
    },

    unixTimestamp: function () {
        var time = Date.now();
        var n = time / 1000;
        return time = Math.floor(n);
    },

    import_csv_file:async function(filePath) {
        let results = [];
        // Read the CSV file and extract its data
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', function (data) {
                results.push(data);
            })
            .on('end', resolve)
            .on('error', reject);
        });
        return results;
    },

    delete_relational_data: async function(whereCondition){
        try{    
            let modelNames = [
                models.USER_DETAILS, models.KYC, models.AVAILABILITIES, models.AVAILABLE_SLOTS, models.AVAILABLE_SLOT_TIMES, models.BANK_DETAILS, models.BOOKING_GUEST_REQUESTS, models.BOOKINGS, models.CARDS,
                models.EARNINGS, models.RANDOM_CERTIFICATE_QUESTIONS, models.REDEEM_COUPONS, models.REFUND_REQUESTS, models.SOCKET_USERS, models.SPECIAL_REQUESTS, models.TRANSACTIONS, models.USER_ADDRESSES, models.USER_POST_VISITORS, models.USER_PROFILE_VISITORS, models.USER_TEMP_POST_VIEWS, models.WITHDRAWL_REQUESTS,models.NOTIFICATIONS, models.POSTS, models.RATINGS, models.REPORTS, models.ORDERS

            ]
            for (const modelName of modelNames) {
                const Model = modelName;
                // return
                if (Model) {
                    const result = await Model.deleteMany(whereCondition);
                    console.log(`Deleted`);
                } else {
                    console.log(`Model not found`);
                }
            }
        }catch(err){
            console.log(err)
            return err;
        }
    }
}