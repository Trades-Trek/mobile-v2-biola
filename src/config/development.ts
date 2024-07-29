export default () => ({
    DB_URL:process.env.DB_URL_DEVELOPMENT,
    DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    TRADES_TREK_VERSION:parseInt(process.env.TRADES_TREK_VERSION) || 2.0,
});