module.exports = {
    success: function (res, message = '', body = {}) {
        return res.status(200).json({
            'success': true,
            'code': 200,
            'message': message,
            'body': body
        });
    },

    error: function (res, err, req) {
        console.log(err, '===========================>error in helper');
        let code = (typeof err === 'object') ? (err.code) ? err.code : 403 : 403;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        if (req) {
            req.flash('flashMessage', {
                color: 'error',
                message
            });
            const originalUrl = req.originalUrl.split('/')[1];
            return res.redirect(`/${originalUrl}`);
        }

        return res.status(code).json({
            'success': false,
            'message': message,
            'code': code,
            'body': {}
        });
    },

    failed: function (res, message = '') {
        message = (typeof message === 'object') ? (message.message ? message.message : '') : message;
        return res.status(400).json({
            'success': false,
            'code': 400,
            'message': message,
            'body': {}
        });
    },
}