module.exports = {

    USER: {
        MODEL_NAME: 'users',
        COL: {
            USERNAME: 'username',
            ROLE: 'role',
            EMAIL: 'email',
            PASSWORD: 'password',
            FORGOT_PASSWORD: 'forgot_password',
            COUNTRY_CODE: 'country_code',
            PHONE: 'phone',
            IMAGE: 'image',
            LOCATION: 'location',
            BIO: 'bio',
            DOB: 'dob',
            GENDER: 'gender',
            OTP: 'otp',
            PERMISSIONS: 'permissions',
            IS_OTP_VERIFIED: 'is_otp_verified',
            IS_PHONE_VERIFIED: 'is_phone_verified',
            IS_EMAIL_VERIFIED: 'is_email_verified',
            RESET_TOKEN: 'reset_token',
            IS_PROFILE_COMPLETE: 'is_profile_complete',
            FIREBASE_TOKEN: 'firebase_token',
            LOGIN_TIME: 'login_time',
            NOTIFICATION_STATUS: 'notification_status',
            IS_VERIFIED: 'is_verified',
            WALLET_BALANCE: 'wallet_balance',
            AGE: 'age',
            ACCESS_TOKEN: 'token',
            STATUS: 'status',
            IS_DELETED: 'is_deleted',
            IS_ACCEPTED_TERMS: 'is_accepted_terms',
            KYC_STATUS: 'kyc_status',
            ACCOUNT_STEPS: 'account_steps',
            CREATED_AT: 'created_at',
            UPDATED_AT: 'updated_at',
        },
        ROLE: {
            ADMIN: 0,
            SUBADMIN: 1,
            CUSTOMER: 2,
        },
        STATUS: {
            INACTIVE: 0,
            ACTIVE: 1
        },
        IS_OTP_VERIFIED: {
            NO: 0,
            YES: 1
        },
        IS_PHONE_VERIFIED: {
            NO: 0,
            YES: 1
        },
        IS_COMPLETE_KYC: {
            NO: 0,
            YES: 1
        },
        IS_EMAIL_VERIFIED: {
            NO: 0,
            YES: 1
        },
        IS_PROFILE_COMPLETE: {
            NO: 0,
            YES: 1
        },
        NOTIFICATION_STATUS: {
            NO: 0,
            YES: 1
        },
        GENDER: {
            MALE: 1,
            FEMALE: 2,
            OTHER: 3
        },
        SOCIAL_TYPE: {
            GOOGLE: 1,
            FACEBOOK: 2,
            APPLE: 3
        },
        IS_DELETED: {
            NO: 0,
            YES: 1
        },
        IS_VERIFIED: {
            NO: 0,
            YES: 1
        },
        KYC_STATUS: {
            PENDING: 0,
            PROCESSING: 1,
            COMPLETE: 2,
            DENIED: 3
        },
        ACCOUNT_STEPS: {
            PERSONAL_INFO: 0,
            VERIFICATION: 1,
            ID_VERIFICATION: 2,
            ACCOUNT_ADDRESS: 3
        },
        IS_ACCEPTED_TERMS: {
            NO: 0,
            YES: 1
        },
    },
    IP_INFO: {
        MODEL_NAME: 'ip_info',
        COL: {
            USER_ID: 'user_id',
            IP_ADDRESS: "ip_address",
            LOCATION: "location",
        }
    },
    NOTIFICATIONS: {
        MODEL_NAME: 'notifications',
        COL: {
            SEND_TO: 'send_to',
            SEND_BY: 'send_by',
            MESSAGE: 'message',
            TYPE: 'type',
            IS_READ: 'is_read',
            STATUS: 'status',
            CREATED_AT: 'created_at',
            UPDATED_AT: 'updated_at',
        },
        STATUS: {
            ACTIVE: 1,
            INACTIVE: 0
        },
        IS_READ: {
            NO: 0,
            YES: 1
        },
        TYPE: {
            CHAT: 0,
            RATING: 1,
            NEW_REQUEST: 2,
            CANCEL_REQUEST: 3,
        },
    },
    SETTING: {
        MODEL_NAME: 'settings',
        COL: {
            LANGUAGE: 'language',
            FREE_SUBSCRIPTION: 'free_subscription',
            FREE_SUBSCRIPTION_SPACE: 'free_subscription_space',
            PAYMENT_METHOD: 'payment_mode',
            STRIPE_KEY: 'stripe_key',
            STATUS: 'status',
        },
        FREE_SUBSCRIPTION: {
            ENABLE: 1,
            DISABLE: 0
        },
        PAYMENT_MODE: {
            LIVE: 1,
            TEST: 0
        },
        STATUS: {
            ACTIVE: 1,
            INACTIVE: 0
        },
    },
    SOCKET_USERS: {
        MODEL_NAME: 'socket_users',
        COL: {
            USER_ID: 'user_id',
            SOCKET_ID: 'socket_id',
            STATUS: 'status',
        },
        STATUS: {
            ONLINE: 1,
            OFFLINE: 0
        },
    },
    NEWS: {
        MODEL_NAME: 'news',
        COL: {
            TITLE: 'title',
            DESCRIPTION: "description",
            IMAGE_URL: "imageUrl",
        }
    },
    BIDS: {
        MODEL_NAME: 'trade',
        COL: {
            USER_ID: 'user_id',
            BID_TYPE: "bidType",
            PAYMENT_METHOD: "paymentMethod",
            CURRENCY: "currency",
            MIN_AMOUNT: "minAmount",
            MAX_AMOUNT: "maxAmount",
            AVERAGE_TIME: "averageTime",
            PROFIT_PERCENTAGE: "profitPercentage",
            STATUS: "status"
        },
        STATUS: {
            ACTIVE: 1,
            IN_ACTIVE: 0
        },
    },
    TRADE: {
        MODEL_NAME: 'trade',
        COL: {
            USER_ID: 'user_id',
            LOCATION: "location",
        }
    },
}