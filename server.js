require("./config/env.config")();
const config = require("./config");
const express = require("express");
const app = express();
app.disable("x-powered-by");
const CorsMiddleware = require("./middleware/cors.middleware");
app.use(CorsMiddleware);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
app.use(bodyParser.json());

const APP_PORT = config.serverSettings.port || 3000;
app.use(morgan("combined"));
app.use(`/${config.name}`, require("./routes"));
app.listen(APP_PORT, () => {
    const DB_NAME = config.logSettings.db;
    const DB_SERVER = config.logSettings.mongoServer;
    const DB_URL = `mongodb://${DB_SERVER}/${DB_NAME}`;
    if (DB_NAME && DB_SERVER) {
        const CircuitBreaker = require('opossum');

        async function connectToMongoDB() {
            try {
                const options = { useNewUrlParser: true, useUnifiedTopology: true };
                await mongoose.connect(DB_URL, options);
                console.log('[✔️] DATABASE IS SUCCESSFULLY CONNECTED.');
            } catch (err) {
                console.error('[x] INITIAL MONGODB CONNECTION FAILED', err);
                throw err;
            }
        }
        const breakerOptions = {
            timeout: 5000,
            errorThresholdPercentage: 50,
            resetTimeout: 30000
        };
        const breaker = new CircuitBreaker(connectToMongoDB, breakerOptions);

        breaker.on('open', () => console.log('Circuit Breaker is open'));
        breaker.on('halfOpen', () => console.log('Circuit Breaker is half open'));
        breaker.on('close', () => console.log('Circuit Breaker is closed'));
        breaker.on('fallback', () => console.log('Circuit Breaker fallback executed'));

        mongoose.connection.on('disconnected', () => {
            console.log('[!] MONGODB DISCONNECTED. ATTEMPTING TO RECONNECT...');
            breaker.fire()
                .then(() => console.log('[✔️] MONGODB RECONNECTION SUCCESSFUL'))
                .catch(err => console.error('[x] MONGODB RECONNECTION FAILED', err));
        });

        breaker.fire()
            .then(() => console.log('[✔️] INITIAL MONGODB RECONNECTION SUCCESSFUL'))
            .catch(err => console.error('[x] INITIAL MONGODB RECONNECTION FAILED', err));
    }
    console.log(`=====SERVER IS SUCCESSFULLY RUNNING AT ${APP_PORT}=====`);
})

module.exports = app
