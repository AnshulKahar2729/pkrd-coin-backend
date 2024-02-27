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
|   Setting Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/setting", (router) => {
    router.use(requireAuthentication);
    router.use(requireHeaders);
    router.post('/change_setting', [validation.changeSetting], controller.changeSetting)

});

module.exports = app;
