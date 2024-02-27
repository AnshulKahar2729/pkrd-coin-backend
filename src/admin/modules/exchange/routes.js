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

    // router.post('/edit', [validation.edit], controller.edit)
    // router.get('/view/:id', [validation.view], controller.view);
    // router.post('/delete/:id', [validation.delete], controller.delete);
});

module.exports = app;

