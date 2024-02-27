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
|   News Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/news", (router) => {
    router.use(requireAuthentication);
    router.use(requireHeaders);
    router.get('/list', controller.list);
    router.get('/view/:id', [validation.view], controller.view);
});

module.exports = app;
