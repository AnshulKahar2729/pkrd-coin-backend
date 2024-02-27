var express = require('express');
var router = express.Router();
require('express-group-routes');
var app = express();


/*
|------------------------------------------------------------------------------------
|  Call routes
|------------------------------------------------------------------------------------
|
*/

/*
|------------------------------------------------------------------------------------
|  Common routes
|------------------------------------------------------------------------------------
|
*/
const authRoute = require('./modules/auth/routes');
const walletRoute = require('./modules/wallet/routes');
const tradeRoute = require('./modules/trade/routes');
const newsRoute = require('./modules/news/routes');
const bidsRoute = require('./modules/bids/routes');
const exchangeRoute = require('./modules/exchange/routes');
const notificationRoute = require('./modules/notification/routes');
const ipRoute = require('./modules/ip_info/routes');
/*
|--------------------------------------------------------------------------------------
|   Api group
|--------------------------------------------------------------------------------------
|
*/
app.group("/api", (router) => {
    /*
    |-----------------------------------------------------------------------------------
    |   Auth Routes
    |-----------------------------------------------------------------------------------
    |
    */
    router.use(authRoute);
    router.use(bidsRoute);
    router.use(walletRoute);
    router.use(tradeRoute);
    router.use(newsRoute);
    router.use(exchangeRoute);
    router.use(notificationRoute);
    router.use(ipRoute)
});

module.exports = app;
