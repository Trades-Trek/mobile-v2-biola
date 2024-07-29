export enum ORDER_TYPE {
    LIMIT = 'limit',
    MARKET = 'market'
}

export enum ORDER_DURATION {
    DAY_ONLY = 'day_only',
    UNTIL_CANCELLED = 'good_until_cancelled'
}

export enum TRADE_ACTION {
    BUY = 'buy',
    SELL = 'sell'
}

export enum ORDER_STATUS {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'CANCELLED'
}