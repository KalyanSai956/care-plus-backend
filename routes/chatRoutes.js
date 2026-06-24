const express = require("express");
const router = express.Router();

const {
  chatBot,
} = require(
  "../controllers/chatController"
);

router.post("/", chatBot);

module.exports = router;