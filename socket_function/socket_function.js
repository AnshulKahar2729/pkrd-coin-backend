
const query = require('./query');
const { SOCKET_USERS, POSTS  } = require('../utils/constants/model.constants');
const MODEL_SOCKET_USERS = 'SOCKET_USERS'
const MODEL_POSTS = 'POSTS'
const MODEL_USER_POST_VISITORS = 'USER_POST_VISITORS'
const MODEL_USER_TEMP_POST_VIEWS = 'USER_TEMP_POST_VIEWS'

module.exports ={
    check_socket_id: async function (connect_listener, socket_id) {
    
        let  whereCondition ={
            user_id : connect_listener.user_id
        }
        let check_user = await query.find_one(MODEL_SOCKET_USERS, whereCondition)
        let create_socket_user
        if (check_user) {
            let updateField = {
                status :SOCKET_USERS.STATUS.ONLINE,
                socket_id:socket_id
            }
            create_socket_user = await query.update_one(MODEL_SOCKET_USERS, whereCondition, updateField)
     
        } else {
            let addFields = {
                user_id: connect_listener.user_id,
                socket_id: socket_id,
                status: SOCKET_USERS.STATUS.ONLINE,
            }
            await query.create(MODEL_SOCKET_USERS, addFields)
        }
        return create_socket_user;
    },

    socket_disconnect: async function (socket_id) {
        let whereCondition = {
            socket_id:socket_id 
        }
        let disconnect_socket_user =  await query.delete(MODEL_SOCKET_USERS, whereCondition)
        return disconnect_socket_user
    },

    provider_post_list: async function (data) {
        try{
            let whereCondition = {
                added_by : POSTS.ADDED_TYPE.PROVIDER,
                added_by: data.user_id,
                is_verified_admin : POSTS.IS_VERIFIED_ADMIN.VERIFIED
            }
            let get_list = await query.find_all(MODEL_POSTS, whereCondition)
            return get_list

        }catch(err){
            throw err;
        }
    },

    update_post_visitor_count_data: async function (data) {
        try{
            let { post_ids } = data
            // post_ids = JSON.parse(post_ids)
            let whereCondition = {
                user_id : data.user_id,
            }
            for(let post_id of post_ids){
                whereCondition.post_id = post_id
                let get_visitor_info = await query.find_one(MODEL_USER_POST_VISITORS,  whereCondition)

                let updateField = {
                    post_id,
                    user_id : data.user_id,
                    view_count : get_visitor_info ? get_visitor_info?.view_count + 1 : 1,
                    view_time : await query.current_time_date()
                }
                await query.findOneAndUpdate(MODEL_USER_POST_VISITORS, whereCondition, updateField)
                await query.findOneAndUpdate(MODEL_USER_TEMP_POST_VIEWS, whereCondition, updateField)
            }
            return {}

        }catch(err){
            throw err;
        }
    },
}