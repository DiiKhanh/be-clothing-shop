const express = require("express");
const router = express.Router();

const imageController = require("../controllers/image");

router.get("/images/intro", imageController.getIntroImages);

module.exports = router;
