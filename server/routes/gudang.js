const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const isValidId = require("../middlewares/isValidId");
const errorHandler = require("../middlewares/errorHandler");
const handler = require("../middlewares/formHandler/gudangHandler");

const contr = require("../controllers/gudangContr");

const router = express.Router();

router.use(requireAuth);

//Get all gudang from user
router.get("/", errorHandler(contr.getAllGudangByUser));

//Create new gudang
router.post("/", handler.createNewGudangHandler, errorHandler(contr.createNewGudang));

//Get gudang data
router.get("/:id", isValidId, errorHandler(contr.getGudangData));

//Get all barang by gudang
router.get("/:id/barang", isValidId, errorHandler(contr.getAllBarangByGudang));

//Update gudang data
router.patch("/:id", isValidId, handler.updateGudangDataHandler, errorHandler(contr.updateGudangData));

//Delete gudang
router.delete("/:id", isValidId, errorHandler(contr.deleteGudang));

module.exports = router;