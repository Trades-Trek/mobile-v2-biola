const minStartingCash: number = parseInt(process.env.MIN_STARTING_CASH)

export enum ERROR_MESSAGES {
    ORDER_NOT_FOUND = 'Could not find order',
    UNAUTHORISED = 'Unauthorised',
    INVALID_CREDENTIALS = 'Invalid credentials',
    INVALID_USER = 'User does not exist',
    COMPETITION_REQUEST_NOT_FOUND = 'Could not find competition request',
    LEARN_RESOURCE_NOT_FOUND = 'could not find learn resource',
    CATEGORY_NOT_FOUND = 'Could not find category',
    INSUFFICIENT_WALLET_BALANCE = 'Insufficient funds in your wallet',
    INSUFFICIENT_TREK_COINS_BALANCE = 'Insufficient trek coins',
    SUBSCRIPTION_EXPIRED = 'Your subscription has not expired',
    NO_SUBSCRIPTION = 'You are not subscribed to any plan',
    SUBSCRIBED = 'You are already subscribed to this plan',
    PAID_PLAN_ACTIVE = 'You are currently on a paid plan',

    RECIPIENT_ON_PAID_PLAN = 'This recipient is currently on an active plan',
    INVALID_BVN = 'Invalid Bvn',
    UNVERIFIED_TRANSACTION = 'Could not verify transaction',
    INVALID_BANK_ACCOUNT = 'Could not resolve account name. Check parameters or try again.',
    PAYSTACK_BAD_GATE = 'Oops, seems our network is poor please try again',

    ALREADY_REFERRED = "This user already joined trades trek",
    PROMO_EXPIRED = 'Promotion campaign has already expired',

    PROMO_NOT_STARTED = 'Promotion campaign is yet to begin',
    PROMO_INVALID = 'Invalid Promo Code',
    ALREADY_EXIST_IN_WATCH_LIST = 'Stock price has already been added to your watchlist',
    WATCHLIST_NOT_FOUND = 'Watchlist does not exist',

    COMPETITION_NOT_FOUND = 'Competition does not exist',
    STARTING_CASH_ERROR = `Competition starting cash should not be less than 5000 or greater than 7000`,
    FORUM_NOT_FOUND = 'Forum does not exist',
    CHAT_NOT_FOUND = 'Chat does not exist',
    STOCk_NOT_FOUND = 'Stock does not exist'


}