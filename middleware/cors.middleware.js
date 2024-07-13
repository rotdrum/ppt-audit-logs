const cors = require("cors");

const corsOptions = {
    origin: process.env.CORS_ORIGIN_ALLOWANCES != undefined ? JSON.parse(process.env.CORS_ORIGIN_ALLOWANCES) : null,
    methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
};

const customCorsMiddleware = cors(corsOptions);

module.exports = customCorsMiddleware;
