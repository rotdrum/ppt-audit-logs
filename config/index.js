module.exports = {
    name: 'audit_logs',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    serverSettings: {
        port: process.env.APP_PORT || 3000
    },
    logSettings: {
        mongoServer: process.env.MONGO_LOG_SERVER,
        ribbitServer: process.env.RABBIT_LOG_SERVER,
        db: process.env.MONGO_LOG_NAME,
        queue: process.env.RABBIT_LOG_QUEUE,
    },
    dbSettings: {
        db: process.env.DB_NAME_FIRST,
        server: process.env.DB_SERVER_FIRST,
    },
    tokenSettings: {
        publicKey: process.env.JWT_TOKEN_SETTING_PUBLIC_KEY,
        apiSecretKey: process.env.YOU_SERVICE_API_KEY,
    }
}