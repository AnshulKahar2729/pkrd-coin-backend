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
const requireAuthentication = require('../../middlewares/admin.authentication').authenticateAdmin;

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
const requireHeaders = require('../../middlewares/admin.headers').authenticateHeader;


/*
|---------------------------------------------------------------------------------
|   Auth Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/auth", (router) => {
    router.use(requireHeaders);
    router.post('/login', [validation.login], controller.login);
    router.post('/forgot_password', [validation.forgot_password], controller.forgot_password)
    router.get('/reset_password_form', [validation.reset_password_form], controller.reset_password_form)
    router.post('/reset_password', [validation.reset_password], controller.reset_password)
    router.use(requireAuthentication);
    router.get('/dashboard', controller.dashboard);
    router.get('/profile', controller.profile);
    router.post('/edit_profile', [validation.edit_profile], controller.edit_profile);
    router.post('/change_password', [validation.change_password], controller.change_password);
    router.get('/logout', controller.logout)
});

module.exports = app;
