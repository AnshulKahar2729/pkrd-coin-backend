   
'use strict';
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const {APP_DEBUG} = require('./app.constants');
module.exports = {
    //mongoDb url
    // mongoUrl:async() => {
    //     let mongoURI = "";
    //     if (process.env.NODE_ENV === "dev") {
    //         mongoURI = ``
    //     } else if (process.env.NODE_ENV === "local") {
    //         mongoURI = `mongodb://localhost:27017/${process.env.DATABASE}`;
    //     }
    //     return mongoURI;
    // },

    //db connection
    dbConnection: async () => {
        try{
            let mongoURI = "";
            if (process.env.NODE_ENV === "dev") {
                mongoURI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.DATABASE}`
            } else if (process.env.NODE_ENV === "local") {
                mongoURI = `mongodb://127.0.0.1:27017/${process.env.DATABASE}`;
            }
            mongoose.plugin(slug);
            mongoose.Promise = global.Promise;
            console.log(mongoURI);
            mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            
            mongoose.connection.on('error', function (err) {
                console.log(err);
                console.log('error in connecting, process is exiting ...');
                process.exit(); 
            });

            mongoose.connection.once('open', function () {
                console.log('Successfully connected to database');
            });
            mongoose.set("debug", APP_DEBUG);
        }catch(err){
            console.log(err, "--error")
        }
    },

}