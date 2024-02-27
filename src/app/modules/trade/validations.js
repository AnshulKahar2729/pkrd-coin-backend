const { Validator } = require("node-input-validator");
const helper = require("./helper");
const { FAILED_API } = require("../../../../utils/return.response");
const { USER } = require("../../../../utils/constants/model.constants");

module.exports = {
  add: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.body, {
      bid_id: "required",
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },

  trade_start: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.body, {
      bid_id: "required",
      PKRDRate: "required", // number only
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },

  engage_user: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.params, {
      id: "required",
      user_id: "required",
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },

  edit: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.body, {
      id: "required",
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },

  view: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.params, {
      id: "required",
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },

  delete: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.params, {
      id: "required",
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },
  update_status: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.body, {
      id: "required",
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },
  cancel_trade: async function (req, res, next) {
    console.log("--------in validation check------------");
    let v = new Validator(req.body, {
      id: "required",
    });
    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return FAILED_API(res, errorsResponse);
    }
    next();
  },
};
