const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event");

router.get("/events/ready-to-sell", eventController.getReadyToSellEvent);

router.get("/events/:eventTag", eventController.getEventByTag);

module.exports = router;
