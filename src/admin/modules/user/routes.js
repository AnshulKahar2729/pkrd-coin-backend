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
|   Customer  Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/user", (router) => {
    router.use(requireHeaders);
    router.use(requireAuthentication);
    router.get('/list', controller.list);
    // router.post('/add', [validation.add], controller.add)
    router.post('/edit', [validation.edit], controller.edit);
    router.get('/view/:id', [validation.view], controller.view);
    router.post('/update_status/:id', [validation.update_status], controller.update_status);
    router.post('/delete/:id', [validation.delete], controller.delete);
    router.post('/import_csv', [validation.import_csv], controller.import_csv);
    router.post('/affliate_code', [validation.affliate_code], controller.affliate_code);

});

module.exports = app;
