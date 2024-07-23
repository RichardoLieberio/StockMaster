const mongoose = require("mongoose");

function isValidId(req, res, next) {
    mongoose.Types.ObjectId.isValid(req.params.id) ? next() : res.json({error: "ID tidak valid"});
}

module.exports = isValidId;