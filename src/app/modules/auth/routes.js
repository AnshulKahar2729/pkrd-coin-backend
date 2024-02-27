var express = require('express');
var router = express.Router();
require('express-group-routes');
var app = express();

/*
|------------------------------------------------------------------------------------
|   App middleware
|------------------------------------------------------------------------------------
|
*/
const requireAuthentication = require('../../middlewares/app.authentication').authenticateUser;

/*
|------------------------------------------------------------------------------------
|  Call controller
|------------------------------------------------------------------------------------
|
*/
const controller = require('./controller');

/*
|------------------------------------------------------------------------------------
|  Call validator
|------------------------------------------------------------------------------------
|
*/
const validation = require('./validations');

/*
|------------------------------------------------------------------------------------
|  Call headers
|------------------------------------------------------------------------------------
|
*/
const requireHeaders = require('../../middlewares/app.headers').authenticateHeader;

/*
|---------------------------------------------------------------------------------
|   Auth Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/auth", (router) => {
    router.use(requireHeaders);
    router.post('/sign_up', [validation.sign_up], controller.sign_up)
    router.post('/login', [validation.login], controller.login)
    router.post('/forgot_password', [validation.forgot_password], controller.forgot_password)
    router.post('/verify_otp', [validation.verify_otp], controller.verify_otp)
    router.post('/resend_otp', [validation.resend_otp], controller.resend_otp)

    router.use(requireAuthentication);
    router.post('/verify_phone_number_email', [validation.verify_phone_number_email], controller.verify_phone_number_email);
    router.post('/change_password', [validation.change_password], controller.change_password);
    router.get('/profile', controller.profile);
    router.post('/edit', controller.edit_profile);
    router.post('/update_phone_email', [validation.update_phone_email], controller.update_phone_email)
    router.post('/complete_kyc_profile', [validation.complete_kyc_profile], controller.complete_kyc_profile)
    router.get('/logout', controller.logout)
});

module.exports = app;
