const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const isValidId = require("../middlewares/isValidId");
const errorHandler = require("../middlewares/errorHandler");
const handler = require("../middlewares/formHandler/barangHandler");

const contr = require("../controllers/barangContr");

const router = express.Router();

router.use(requireAuth);

//Create new barang
router.post("/", handler.createNewBarangHandler, errorHandler(contr.createNewBarang));

//Get barang data
router.get("/:id", isValidId, errorHandler(contr.getBarangData));

//Update barang data
router.patch("/:id", isValidId, handler.updateBarangDataHandler, errorHandler(contr.updateBarangData));

//Delete barang
router.delete("/:id", isValidId, errorHandler(contr.deleteBarang));

module.exports = router;