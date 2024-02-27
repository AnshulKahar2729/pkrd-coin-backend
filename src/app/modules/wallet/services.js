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
const { v4: uuidv4 } = require("uuid");

//models
const MODEL_NAME = "WALLET";

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

  /*************** Add  *********************/
  add_data: async (req, res) => {
    try {
      req.body.user_id = req.user?._id;
      const whereCondition = {
        user_id: req.body.user_id,
      };
      let getData = await query.find_one(MODEL_NAME, whereCondition);
      if (getData) {
        return getData;
      }
      let data = await query.create(MODEL_NAME, req.body);
      return data;
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

  find_one_by_userId: async (req, res) => {
    try {
      let whereCondition = {
        user_id: req.user?._id,
      };
      console.log(whereCondition, "whereCondition");
      let includeModule = {
        main_id: "user_id user_id",
        values: "username email",
      };
      console.log(includeModule, "includeModule");
      let getData = await query.find_one(MODEL_NAME, whereCondition);
      console.log(getData, "getData");

      if (getData) {
        console.log(getData, "getData inside if");
        return getData;
      } else {
        return {}
      }
    } catch (error) {
      throw error;
    }
  },
};
