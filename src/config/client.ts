export default () => ({
    ENCRYPTION_KEY:process.env.ENCRYPTION_KEY,
    ENCRYPTION_IV:process.env.ENCRYPTION_IV,
    DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    TRADES_TREK_VERSION:parseInt(process.env.TRADES_TREK_VERSION) || 2.0,
});