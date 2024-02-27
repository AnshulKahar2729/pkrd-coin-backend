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
|   Trade Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/notification", (router) => {
    router.use(requireAuthentication);
    router.use(requireHeaders);
    router.get('/list', controller.list);
    router.post('/add', [validation.add], controller.add);
    router.post('/edit', [validation.edit], controller.edit);
    router.put('/read-notification', [validation.read_notification], controller.read_notification);
});

module.exports = app;
