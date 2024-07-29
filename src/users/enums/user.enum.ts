export enum USER {
    ID = '_id',
    FIRSTNAME = 'first_name',
    Role = 'role',
    LASTNAME = 'last_name',
    FULL_NAME = 'full_name',
    EMAIL = 'email',
    USERNAME = 'username',
    VERIFIED = 'verified',
    PASSWORD = 'password',

    REFERRAL_CODE = 'referral_code',

    SETTINGS = 'settings',

    SUBSCRIPTION = 'subscription',

    HAS_PIN = 'has_pin',

    HAS_SUBSCRIBED = 'has_subscribed',

    PIN = 'pin',

    TOTAL_FOLLOWERS = 'total_followers',

    WALLET = 'wallet',

    REFERRER = 'referrer_code',

    TREK_COIN_BALANCE = 'trek_coin_balance',

    TOTAL_FOLLOWING = 'total_following',
    IS_FIRST_PURCHASE = 'is_first_trek_coins_purchase',
    IS_ACTIVE = 'is_active',


    DEFAULT_FIELDS = `${REFERRAL_CODE} ${EMAIL}, ${USERNAME} ${EMAIL} ${USERNAME} ${FIRSTNAME} ${LASTNAME} ${FULL_NAME} ${SETTINGS} ${SUBSCRIPTION} ${HAS_PIN}, ${TOTAL_FOLLOWING}, ${TOTAL_FOLLOWERS} ${TREK_COIN_BALANCE} ${WALLET} ${VERIFIED} ${HAS_SUBSCRIBED} ${REFERRER} ${IS_FIRST_PURCHASE} ${Role} ${IS_ACTIVE}`,

    DEFAULT_SERVER_FIELDS = `${DEFAULT_FIELDS} ${PASSWORD} ${PIN}`


}