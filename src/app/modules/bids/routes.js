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
|   Bids Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/bids", (router) => {
    router.use(requireAuthentication);
    router.use(requireHeaders);
    router.get('/list',controller.list);  // done hain
    router.post('/add', [validation.add], controller.add)  // done hain
    router.post('/edit', [validation.edit], controller.edit)
    router.get('/view/:id',[validation.view], controller.view);   // done hain
    router.post('/delete/:id', [validation.delete], controller.delete);  // done hain

});

module.exports = app;
