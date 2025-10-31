const express = require("express");
const { question, viewHistory, deleteHistory } = require("../controllers/chatController");
const authorization = require("../middlewares/authorization");
const router = express.Router();

router.use(authorization);
router.post("/question", question);
router.get("/viewChat", viewHistory);
router.delete("/deleteChat/:id", deleteHistory);

module.exports = router;