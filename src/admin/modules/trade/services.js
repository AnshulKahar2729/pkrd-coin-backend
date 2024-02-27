const mongoose = require("mongoose");
const { Types } = mongoose;

const {
  APP_DEFAULT_LANGUAGE,
  PAGE_SIZE,
} = require("../../../../utils/constants/app.constants");
const {
  SOMETHING_WENT_WRONG,
  NOT_FOUND,
  ALREADY_EXISTS_QUESTION,
} = require("../../../../utils/constants/message.constants");
const {
  SUBSCRIPTION_PLANS,
} = require("../../../../utils/constants/model.constants");
const query = require("./query");
const { unixTimestamp } = require("./helper");
//models
const MODEL_NAME = "TRADES";

module.exports = {
  /*************** get list with pagination *********************/
  get_list_pagination: async (req, res) => {
    try {
      let { page, limit } = req.query;

      let currentPage = parseInt(page ? page : 1);
      limit = parseInt(limit ? limit : PAGE_SIZE);
      let whereCondition = { user_id: req?.user?._id };
      let includeModule = {
        main_id: "user_id bid_id",
        values: "_id username paymentMethod bidType",
      };

      let getData = [];
      getData =
        await query.find_all_and_count_with_populate_include_with_pagination(
          MODEL_NAME,
          whereCondition,
          includeModule,
          limit,
          currentPage
        );

      if (getData) {
        return getData;
      } else {
        throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** add  *********************/
  add_data: async (req, res) => {
    try {
      req.body.user_id = req.user?._id;
      let createData = await query.create(MODEL_NAME, req.body);
      if (createData) {
        return createData;
      } else {
        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** Trade Start  *********************/
  trade_start: async (req, res) => {
    try {
      req.body.user_id = req.user?._id;
      req.body.trade_start = new Date();
      console.log(req.user?._id, "USER_ID");

      let createData = await query.create_with_populate(MODEL_NAME, req.body);
      console.log(createData);
      if (createData) {
        return createData;
      } else {
        throw new Error(SOMETHING_WENT_WRONG[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** engage User  *********************/
  engage_user: async (req, res) => {
    try {
      let { id, user_id } = req.params;
      console.log(id, user_id, "ID AND USER_ID");
      let whereCondition = {
        _id: id,
      };
      let data = {
        engage_user_id: user_id,
      };

      await query.update(MODEL_NAME, whereCondition, data);
      let getData = await query.find_one(MODEL_NAME, whereCondition);
      console.log(getData, "UPDATED DATA");
      return { getData };
    } catch (error) {
      throw error;
    }
  },
  /*************** update  *********************/
  edit_data: async (req, res) => {
    try {
      let { id } = req.body;
      let whereCondition = {
        _id: id,
      };

      await query.update(MODEL_NAME, whereCondition, req.body);
      return {};
    } catch (error) {
      throw error;
    }
  },

  /*************** get data by id*********************/
  get_data_by_id: async (req, res) => {
    try {
      let { id } = req.params;
      let whereCondition = {
        _id: id,
      };
      let includeModule = {
        main_id: "bid_id user_id engage_user_id",
        values: "user_id averageTime",
      };

      let includeModules = {};

      let getData = await query.find_one_with_populates(
        MODEL_NAME,
        whereCondition,
        includeModule,
        includeModules
      );

      if (getData) {
        return getData;
      } else {
        throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },

  /*************** update status  *********************/
  update_status: async (req, res) => {
    try {
      let { id, complete_by_user, complete_by_engage_user } = req.body;
      let whereCondition = {
        _id: id,
      };
      let getData = await query.find_one(MODEL_NAME, whereCondition);
      if (complete_by_user === 1) {
        req.body.status = getData?.complete_by_engage_user === 1 ? 2 : 1;
      }
      if (complete_by_engage_user === 1) {
        req.body.status = getData?.complete_by_user === 1 ? 2 : 1;
      }

      // Update the document with fields other than intervals
      await query.update(MODEL_NAME, whereCondition, req.body);

      return {};
    } catch (error) {
      throw error;
    }
  },

  /*************** delete *********************/
  delete_data: async (req, res) => {
    try {
      let { id } = req.params;
      let whereCondition = {
        _id: id,
      };
      let getData = await query.find_one(MODEL_NAME, whereCondition);
      if (getData) {
        await query.delete(getData);
        return {};
      } else {
        throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },
  cancel_trade: async (req, res) => {
    try {
      let { id } = req.body;
      let whereCondition = {
        _id: id,
      };
      let getData = await query.find_one(MODEL_NAME, whereCondition);
      console.log(getData, "GET DATA");
      if (getData) {
        req.body.status = 3;
        const getData = await query.update(
          MODEL_NAME,
          whereCondition,
          req.body
        );
        return getData;
      } else {
        throw new Error(NOT_FOUND[APP_DEFAULT_LANGUAGE]);
      }
    } catch (error) {
      throw error;
    }
  },
};
