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

app.group("/account_setting", (router) => {
    router.use(requireAuthentication);
    router.use(requireHeaders);
    router.get('/list', controller.list);
    router.post('/add', controller.add)

});

module.exports = app;
