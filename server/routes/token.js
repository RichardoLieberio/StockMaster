const express = require("express");

const contr = require("../controllers/tokenContr");

const router = express.Router();

router.get("/", contr.createAccessToken);

module.exports = router;