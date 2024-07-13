const amqp = require('amqplib');
const { MongoClient } = require('mongodb');
const config = require("../config");
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const AuditLog = require('../models/audit_logs.model');  // import your model

module.exports.publishMessage = async (req, res) => {
    try {
        const data = {
            username: req.body.username || null,
            remark: req.body.remark || null,
            endpoint: req.body.endpoint,
            method: req.body.method,
            request: req.body.request,
            date: new Date(),
            status: req.body.status
        };

        await sendToRabbitMQ(data).catch(console.error);

        res.status(200).send('Message sent to RabbitMQ');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error sending message to RabbitMQ');
    }
}

async function sendToRabbitMQ(message) {
    const RABBIT_SERVER = config.logSettings.ribbitServer;
    const RABBIT_QUEUE = config.logSettings.queue;

    try {
        const rabbitmqUrl = `amqp://${RABBIT_SERVER}`;
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();

        await channel.assertQueue(RABBIT_QUEUE, { durable: false });
        await channel.sendToQueue(RABBIT_QUEUE, Buffer.from(JSON.stringify(message)));

        console.log(`Message sent to RabbitMQ: ${JSON.stringify(message)}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports.consumeMessage = async (req, res) => {
    const DB_NAME = config.logSettings.db;
    const DB_SERVER = config.logSettings.mongoServer;
    const RABBIT_SERVER = config.logSettings.ribbitServer;
    const RABBIT_QUEUE = config.logSettings.queue;

    try {
        const rabbitmqUrl = `amqp://${RABBIT_SERVER}`;
        const mongoUrl = `mongodb://${DB_SERVER}`;
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();

        await channel.assertQueue(RABBIT_QUEUE, { durable: false });

        console.log(`Waiting for messages in ${RABBIT_QUEUE}. To exit, press CTRL+C`);

        const client = new MongoClient(mongoUrl);
        await client.connect();
        const db = client.db(DB_NAME);

        channel.consume(RABBIT_QUEUE, async (message) => {
            if (message) {
                try {
                    const msgContent = JSON.parse(message.content.toString());
                    console.log(`Received message from RabbitMQ: ${JSON.stringify(msgContent)}`);

                    const document = {
                        username: msgContent.username,
                        endpoint: msgContent.endpoint,
                        method: msgContent.method,
                        remark: msgContent.remark,
                        date: msgContent.date,
                        request: msgContent.request,
                        status: msgContent.status
                    };

                    const newAuditLog = new AuditLog(document);
                    await newAuditLog.save();

                    console.log(`Message '${JSON.stringify(document)}' inserted into MongoDB`);
                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing message:', error.message);
                    channel.nack(message);
                    res.status(500).send('Error consuming message from RabbitMQ');
                }
            }
        });

        res.status(200).send('Message consume success');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error consuming message from RabbitMQ');
    }
}

// example send log
module.exports.sendMessage = async (req, res) => {
    try {
        const TOKEN_PUBLIC_KEY = config.tokenSettings.publicKey;
        if (_.isUndefined(TOKEN_PUBLIC_KEY)) {
            return res.status(500).send('Token public key not found');
        }

        const endpoint = req.originalUrl;
        const method = req.method;
        const originalSend = res.send.bind(res);

        const bearerToken = req.headers['authorization'];
        let data = {
            username: null,
            endpoint: endpoint,
            method: method,
            date: new Date(),
            status: null
        };

        if (bearerToken) {
            const token = bearerToken.split(' ')[1];
            const decoded = jwt.verify(token, TOKEN_PUBLIC_KEY);
            data.username = decoded.username;
        }

        res.send = async (body) => {
            data.status = res.statusCode;
            await sendToRabbitMQ(data).catch(console.error);
            originalSend(body);
        };

        res.status(200).send('Message sent to RabbitMQ');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error sending message to RabbitMQ');
    }
}