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
|   Exchange Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/exchange", (router) => {
    router.use(requireAuthentication);
    router.use(requireHeaders);
    router.get('/list', controller.list);
    router.post('/add', [validation.add], controller.add)
    router.post('/update-status', [validation.update_status], controller.update_status)

});

module.exports = app;

