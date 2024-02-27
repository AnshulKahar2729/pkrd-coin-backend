var express = require('express');
var router = express.Router();

/*
|------------------------------------------------------------------------------------
|  Call controller
|------------------------------------------------------------------------------------
|
*/
const controller = require('./controller');
/*
|------------------------------------------------------------------------------------
|   App middleware
|------------------------------------------------------------------------------------
|
*/
const requireAuthentication = require('../../../app/middlewares/app.authentication').authenticateUser;

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
const requireHeaders = require('../../middlewares/common.headers').authenticateHeader;

/*
|-------------------------------------------------------------------------------------
|   Basic Routes
|-------------------------------------------------------------------------------------
|
*/
router.post('/encryptionForSkPk', [validation.encryptionForSkPk], controller.encryptionForSkPk)
router.get('/page/:name', [requireHeaders, validation.page], controller.page)
router.post('/page/accpet_cms', [requireHeaders, validation.accpet_cms], controller.accpet_cms)
router.post('/upload_image', [validation.upload_image], controller.upload_image_s3_buket)
router.post('/delete_image', [validation.delete_image], controller.delete_image_s3_buket)

/*
|-------------------------------------------------------------------------------------
|   Basic Admin Routes
|-------------------------------------------------------------------------------------
|
*/
router.post('/admin_signup', requireHeaders, controller.admin_signup)
router.post('/content_page', [requireHeaders, validation.content_page], controller.content_page)
/*
|-------------------------------------------------------------------------------------
|   Basic App Routes
|-------------------------------------------------------------------------------------
|
*/

router.get('/category/list', [requireHeaders, requireAuthentication], controller.category_list)
router.get('/subcategory/list/:id', [requireHeaders, requireAuthentication, validation.subcategory_list], controller.subcategory_list)
router.get('/subcategory/detail/:id', [requireHeaders, requireAuthentication, validation.subcategory_detail], controller.subcategory_detail)
router.get('/post_videos/:category_id/:subcategory_id', [requireHeaders, requireAuthentication, validation.post_videos], controller.post_video_list)
router.get('/setting/list', requireHeaders, controller.setting_list)
router.get('/certificate_question/:category_id/:subcategory_id', [requireHeaders, requireAuthentication], controller.certificate_question)

module.exports = router;
