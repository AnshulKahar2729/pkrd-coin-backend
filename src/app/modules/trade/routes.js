var express = require("express");
var router = express.Router();
require("express-group-routes");
var app = express();

/*
|------------------------------------------------------------------------------------
|   App middleware
|------------------------------------------------------------------------------------
|
*/
const requireAuthentication =
  require("../../middlewares/app.authentication").authenticateUser;

/*
|------------------------------------------------------------------------------------
|  Call controller
|------------------------------------------------------------------------------------
|
*/
const controller = require("./controller");

/*
|------------------------------------------------------------------------------------
|  Call validator
|------------------------------------------------------------------------------------
|
*/
const validation = require("./validations");

/*
|------------------------------------------------------------------------------------
|  Call headers
|------------------------------------------------------------------------------------
|
*/
const requireHeaders =
  require("../../middlewares/app.headers").authenticateHeader;

/*
|---------------------------------------------------------------------------------
|   Trade Routes
|---------------------------------------------------------------------------------
|
*/

app.group("/trade", (router) => {
  // router.use(requireAuthentication);
  router.use(requireHeaders);
  router.get("/list", controller.list);
  router.post("/add", [validation.add], controller.add);
  router.post("/edit", [validation.edit], controller.edit);
  router.get("/view/:id", [validation.view], controller.view);
  router.post("/delete/:id", [validation.delete], controller.delete);
  router.post("/trade-start", [validation.trade_start], controller.trade_start);
  router.post("/engage-user/:user_id/:id", [validation.engage_user], controller.engage_user);
  router.post('/update-status', [validation.update_status], controller.update_status);
  router.post('/cancel-trade', [validation.cancel_trade], controller.cancel_trade);

});

module.exports = app;
