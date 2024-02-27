
const { ENC_SECRET_KEY, ENC_PUBLISH_KEY, APP_DEFAULT_LANGUAGE } = require('./utils/constants/app.constants');
const { check_socket_id, socket_disconnect, provider_post_list, update_post_visitor_count_data} = require('./socket_function/socket_function')
const { SUCCESS_RESPONSE } = require('./utils/return.response');
const { SOCKET_CONNECT, GET_LIST, UPDATE_SUCCESS} = require('./utils/constants/message.constants')

module.exports = function (io) {
    io.use(function(socket, next){
        // console.log(socket,'-------------socket-----------------------');
        socket.auth = false;
        const secretkey = socket.handshake.headers.secretkey;
        const publishkey = socket.handshake.headers.publishkey;

        if (secretkey == ENC_SECRET_KEY && publishkey == ENC_PUBLISH_KEY ){
            next();
            return
        }
        else {
            next(new Error('Authentication error'));
        }
    })

    io.on('connection', function (socket, next) {
        //connect
        socket.on('connect_user', async function (connect_listener) {
            try {
                let socket_id = socket.id
                await check_socket_id(connect_listener, socket_id);

                let success_message = SUCCESS_RESPONSE(SOCKET_CONNECT[APP_DEFAULT_LANGUAGE], {})

                socket.emit('connect_listener', success_message);
            } catch (error) {
                throw error
            }
        });

        //disconnect
        socket.on('disconnect', async function () {
            let socket_id = socket.id
            await socket_disconnect(socket_id)
            console.log('socket user disconnected');
        });

        //provider post video list
        socket.on('provider_post_video_list', async function (data) {
            if(data){
              var get_data_list = await provider_post_list(data);

              if (get_data_list) {
                let finalData = SUCCESS_RESPONSE(GET_LIST[APP_DEFAULT_LANGUAGE], get_data_list)
                socket.emit('provider_post_video_list', finalData);
              }
            }
        });

        //update post visitor count
        socket.on('update_post_visitor_count', async function (data) {
            if(data){
              var get_list = await update_post_visitor_count_data(data);
              if (get_list) {
                let finalData = SUCCESS_RESPONSE(UPDATE_SUCCESS[APP_DEFAULT_LANGUAGE], get_list)
                socket.emit('update_post_visitor_count', finalData);
              }
            }
        });


    });
}