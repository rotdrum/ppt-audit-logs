const Route = require("express").Router();

const RabbitController = require("../controllers/rabbit.controller");

Route.get("/send", RabbitController.sendMessage); // example route
Route.post("/publish", RabbitController.publishMessage);
Route.post("/consume", RabbitController.consumeMessage);

module.exports = Route;