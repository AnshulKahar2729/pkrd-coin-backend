const { Validator } = require('node-input-validator');
const helper = require('./helper')
const response = require('../../app.response');
const { FAILED_API } = require('../../../../utils/return.response');
const { USER } = require('../../../../utils/constants/model.constants');

module.exports = {
    sign_up: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            email: 'required|email',
            country_code: 'required',
            phone: 'required',
            full_phone_number: 'required',
            password : 'required'
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        // if (req.body.role == 3 && req.body.type == 1) {
        //     let v2 = new Validator(req.body, {
        //       duration_id: "required",
        //       longitude: 'required',
        //       latitude: 'required',
        //     });
        //     let errorsResponse2 = await helper.checkValidation(v2);

        //     if (errorsResponse2) {
        //         return FAILED_API(res, errorsResponse2)
        //     }
        // }
        // if (req.body.type == 1) {
        //     let v3 = new Validator(req.body, {
        //         username: 'required', 
        //         last_name: 'required', 
        //         email: 'required|email', 
        //         password: 'required',
        //         country_code: 'required',
        //         phone: 'required',
        //         full_phone_number: 'required',
        //         firebase_token: 'required',
        //         // role: 'required|in:0,1,2,3', // 0 - admin , 1 - subadmin , 2 - customer , 3 - service provider,
        //     });
        //     let errorsResponse3 = await helper.checkValidation(v3);

        //     if (errorsResponse3) {
        //         return FAILED_API(res, errorsResponse3)
        //     }
        // }
        next();
    },

    login: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            type: 'required|in:0,1',
            password: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return response.failed(res, errorsResponse)
        }
        next();
        if (req.body.type == 0) {
            let v2 = new Validator(req.body, {
                email: 'required|email',
            });
            let errorsResponse2 = await helper.checkValidation(v2);

            if (errorsResponse2) {
                return FAILED_API(res, errorsResponse2)
            }
        }
        if (req.body.type == 1) {
            let v3 = new Validator(req.body, {
                phone: 'required',
                country_code: 'required',
            });
            let errorsResponse3 = await helper.checkValidation(v3);

            if (errorsResponse3) {
                return FAILED_API(res, errorsResponse3)
            }
        }
    },

    verify_otp: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            otp: 'required',
            type: 'required|in:0,1,2',  // 0 for email 1 for phone number 2 for email and phone
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return response.failed(res, errorsResponse)
        }
        next();
        if (req.body.type == 0) {
            let v2 = new Validator(req.body, {
                email: 'required|email',
            });
            let errorsResponse2 = await helper.checkValidation(v2);

            if (errorsResponse2) {
                return FAILED_API(res, errorsResponse2)
            }
        }
        if (req.body.type == 1) {
            let v3 = new Validator(req.body, {
                //full_phone_number: 'required',
                phone: 'required',
                country_code: 'required',
            });
            let errorsResponse3 = await helper.checkValidation(v3);

            if (errorsResponse3) {
                return FAILED_API(res, errorsResponse3)
            }
        }
        if (req.body.type == 2) {
            let v3 = new Validator(req.body, {
                phone: 'required',
                //full_phone_number: 'required',
                country_code: 'required',
                email: 'required|email',
            });
            let errorsResponse3 = await helper.checkValidation(v3);

            if (errorsResponse3) {
                return FAILED_API(res, errorsResponse3)
            }
        }
    },

    change_password: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            old_password: 'required',
            new_password: 'required|different:old_password',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return response.failed(res, errorsResponse)
        }
        next();
    },

    forgot_password: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            email: 'required|email',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    verify_phone_number_email: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            type: 'required|in:0,1',  // 0 for email 1 for phone number
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        if (req.body.type == 0) {
            let v2 = new Validator(req.body, {
                email: 'required|email',
            });
            let errorsResponse2 = await helper.checkValidation(v2);

            if (errorsResponse2) {
                return FAILED_API(res, errorsResponse2)
            }
        }
        if (req.body.type == 1) {
            let v3 = new Validator(req.body, {
                phone: 'required',
                country_code: 'required',
                full_phone_number: 'required',
            });
            let errorsResponse3 = await helper.checkValidation(v3);

            if (errorsResponse3) {
                return FAILED_API(res, errorsResponse3)
            }
        }
        next();
    },

    activate_account: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            reset_token: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return FAILED_API(res, errorsResponse)
        }
        next();
    },

    complete_kyc_profile: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            id_photo: 'required',
            front_licence_photo: 'required',
            back_licence_photo: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return response.failed(res, errorsResponse)
        }
        next();
    },

    update_phone_email: async function (req, res, next) {
        console.log('--------in validation check------------')
        let v = new Validator(req.body, {
            // email: 'required', 
            // phone: 'required', 
            // country_code: 'required', 
            // full_phone_number: 'required', 
            // type: 'required|in:1,2',  // 1 - email, 2 - phone
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return response.failed(res, errorsResponse)
        }
        next();
    },

    resend_otp: async function (req, res, next) {
        console.log('--------in validation check------------')
        console.log('here')
        let v = new Validator(req.body, {
            type: 'required|in:0,1,2',  // 0 for email 1 for phone number 2 for both
        });
        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            console.log('here')
            return FAILED_API(res, errorsResponse)
        }
        if (req.body.type == 0) {
            let v2 = new Validator(req.body, {
                email: 'required|email',
            });
            let errorsResponse2 = await helper.checkValidation(v2);

            if (errorsResponse2) {
                return FAILED_API(res, errorsResponse2)
            }
        }
        if (req.body.type == 1) {
        	console.log('validation typ1 resend otp')
            let v3 = new Validator(req.body, {
            	
                phone: 'required',
                country_code: 'required',
                // full_phone_number: 'required',
            });
            console.log('validation typ1 resend otp')
            let errorsResponse3 = await helper.checkValidation(v3);

            if (errorsResponse3) {
            	console.log('fail hua')
                return FAILED_API(res, errorsResponse3)
            }
        }
       
        if (req.body.type == 2) {
            let v2 = new Validator(req.body, {
                email: 'required|email',
                phone: 'required',
                country_code: 'required',
            });
            let errorsResponse2 = await helper.checkValidation(v2);

            if (errorsResponse2) {
                return FAILED_API(res, errorsResponse2)
            }
        }
        next();
    },
}
