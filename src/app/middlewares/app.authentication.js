const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const MODELS = require('../../../models');

const { JWT_SECRET_KEY, APP_DEFAULT_LANGUAGE } = require('../../../utils/constants/app.constants');
const { ERROR_API } = require('../../../utils/return.response');
const { INVALID_TOKEN, AUTHORIZATION_ERROR } = require('../../../utils/constants/message.constants');
const jwtSecretKey = JWT_SECRET_KEY;

// Setup options for JWT Strategy
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = jwtSecretKey;

// Create JWT Strategy
passport.use('user', new JwtStrategy(jwtOptions, 
    async function(payload, done) {
        try {
            // console.log(payload,'---payload--');
            var criteria = {
                _id: payload.data._id,
                // login_time: payload.data.iat,
                login_time: payload.data.login_time
            }
            const existingUser = await MODELS.USERS.findOne(criteria);
            if (existingUser) {
                // console.log(existingUser, '===============>loggedInUser');
                return done(null, existingUser);
            }
            return done(null, false);
        } catch(e) {
            console.log('not local');
            console.log(e);
            // return done(e, false);
        }
    }
));

module.exports = {
    initialize: function () {
        return passport.initialize();
    },

    authenticateUser: function (req, res, next) {
        return passport.authenticate("user", {
            session: false
        }, (err, user, info) => {
			// console.log(err, '=======================>passport err');
			// console.log(info, '=======================>passport info');
			// console.log(info && info['name'], '=======================>passport info[name]');
			// console.log(user, '=======================>passport err user');

            if (err) {
                return ERROR_API(res, err);
            }
            if (info && info.hasOwnProperty('name') && info.name == 'JsonWebTokenError') {
                return ERROR_API(res, {
					message: INVALID_TOKEN[APP_DEFAULT_LANGUAGE]
				});
            } else if (user == false) {
                return ERROR_API(res, {
					message: AUTHORIZATION_ERROR[APP_DEFAULT_LANGUAGE]
				});
            }            
            // Forward user information to the next middleware
            req.user = user; 
            next();
            console.log(user);
        })(req, res, next);
    },


};


