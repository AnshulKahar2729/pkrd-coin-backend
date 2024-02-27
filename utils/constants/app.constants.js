'use strict';

module.exports = {
    APP_DEFAULT_PORT : process.env.PORT,
    APP_DEFAULT_LANGUAGE : 'en',
    APP_DEFAULT_NAME : 'pkrd',
    PAGE_SIZE : 10,
    SECURITY_KEY : process.env.SECURITY_KEY,
    APP_VERSION : 'V1',
    APP_DEBUG : false,
    APP_SHORT_NAME : 'ZA',
    APP_FAV_URL : '/assets/img/fav.png',
    APP_LOGO_URL : '/images/logo.png',
    RESET_PASSWORD : '/admin/reset_password/',
    ACTIVATE_ACCOUNT : '/admin/verify_account/',
    ADMIN_FULL_URL : '',
    COPYRIGHT_YEAR : 2023,
    COMPANY_URL : '#',
    COMPANY_NAME : 'New app',
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY,
    SECRET_KEY : process.env.SECRET_KEY,
    PUBLISH_KEY : process.env.PUBLISH_KEY,
    ENCRYPTION_KEY : process.env.ENCRYPTION_KEY,
    ENC_SECRET_KEY : process.env.ENC_SECRET_KEY,
    ENC_PUBLISH_KEY : process.env.ENC_PUBLISH_KEY,
    OTP_TYPE : 2, //type 1 = random 5 digit, 2 = static otp
    STATIC_OTP : 12121,
    OTP_LENGTH : 5,
    QUESTION_LIMIT : 20,
    CANCEL_48_HOURS_FOR_CUSTOMER : 48,
    CANCEL_24_HOURS_FOR_CUSTOMER : 24,
    EMAIL_VERIFY_URL: 'https://api.mailgun.net/v4/address/validate?address',
    S3_BUCKET_URL : "",
    AWS : {
        SECRET_ACCESS_KEY : "",
        SECRET_ACCESS_ID : "",
        REGION_NAME : "",
        BUCKET_NAME : ""
    },
    MAIL_GUN : {
        MAILGUN_API_KEY : "key-758aa69dd3ab8d90ee489d22d915ccfetest",
        MAILGUN_DOMAIN : "mg.ondemandcreations.comtest",
        MAILGUN_FROM : "<no-reply@mg.ondemandcreations.com>test",
        MAIL_GUN_AUTH : "Basic YXBpOmtleS03NThhYTY5ZGQzYWI4ZDkwZWU0ODlkMjJkOTE1Y2NmZQ==test"
    },
    TWILIO: {
        ACCOUNTSID: "ACd80ded9cb2d424ccae9e958694308db8",
        AUTH_TOKEN: "5eadd79d5e23d338baa81bab8ed1b9f5",
        TWILIO_FROM: "+12293634620",
        TWILIO_FROM_WHATSAPP: "+14155238886"
    },
    //stripe keys form splash ark
    STRIPE:{
        STRIPE_SCERET_KEY : "sk_test_51LuGO1G8Ho6yUzVTb8gCN00ZVEJbfsaxvROIqcQFu0XAoT3sghBq8PBPrdxb8m3pPeYvUhm3P2G4llQIp7RX80Yv00DoPkHlsk",
        STRIPE_PUBLISH_KEY : "pk_test_51LuGO1G8Ho6yUzVTHQkeKzfK9EcctegXvOfM1XjOdjJ5iTjiCxpdu9g5QRaI0CCBSzJMjdHkHWyQkAVbn2H1UUpV00ke1LzNCN"
    }

}