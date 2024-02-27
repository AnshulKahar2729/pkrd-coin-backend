var express = require('express');
require('express-group-routes');
var app = express();

/*
|------------------------------------------------------------------------------------
|  Call routes
|------------------------------------------------------------------------------------
|
*/
const authRoute = require('./modules/auth/routes');
const userRoute = require('./modules/user/routes');
const settingRoute = require('./modules/setting/routes');
const ipInfo = require('./modules/ip_info/routes');
const exchange = require('./modules/exchange/routes');
const accountSettingRoute = require('./modules/account_setting/routes');
const tradeRoute = require('./modules/trade/routes');

/*
|--------------------------------------------------------------------------------------
|   Service Provider Api group
|--------------------------------------------------------------------------------------
|
*/
module.exports = (io) => {
    app.group("/admin_api", (router) => {
        /*
        |-----------------------------------------------------------------------------------
        |   Service Provider basic Routes
        |-----------------------------------------------------------------------------------
        |
        */
        router.use(authRoute)

        /*
        |------------------------------------------------------------------------------------
        |   USER Routes
        |------------------------------------------------------------------------------------
        |
        */
        router.use(userRoute)
        /*
        |------------------------------------------------------------------------------------
        |   IP INFO Routes
        |------------------------------------------------------------------------------------
        |
        */
        router.use(ipInfo)

        /*
       |------------------------------------------------------------------------------------
       |   Exchange Routes
       |------------------------------------------------------------------------------------
       |
       */
        router.use(exchange)


        /*
        |------------------------------------------------------------------------------------
        |   Setting Route
        |------------------------------------------------------------------------------------
        |
        */
        router.use(settingRoute)

        /*
        |------------------------------------------------------------------------------------
        |   account Setting Route
        |------------------------------------------------------------------------------------
        |
        */
        router.use(accountSettingRoute);

        router.use(tradeRoute);


    });
    return app;
}
// module.exports = app;
