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
const MODEL_NAME = "NOTIFICATIONS";

module.exports = {
  /*************** get list with pagination *********************/
  get_list_pagination: async (req, res) => {
    try {
      let { page, limit } = req.query;

      let currentPage = parseInt(page ? page : 1);
      limit = parseInt(limit ? limit : PAGE_SIZE);
      let whereCondition = { user_id: req?.user?._id };
      let includeModule = {
        main_id: "user_id user_id",
        values: "username email",
      };

      let getData = [];
      getData =
        await query.find_all_and_count_with_populate_include_with_pagination(
          MODEL_NAME,
          whereCondition,
          includeModule,
          limit,
          currentPage,
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
      req.body.user_id = req?.user?._id
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

  /*************** read notification  *********************/
  read_notification: async (req, res) => {
    try {
      let whereCondition = {
        user_id: req.user?._id,
        is_read: 0
      };
      console.log(whereCondition, "===whereCondition");
      await query.update(MODEL_NAME, whereCondition, { is_read: 1 });
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
      let includeModule = {};

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


};
