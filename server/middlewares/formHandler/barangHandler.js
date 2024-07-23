const mongoose = require("mongoose");

function createNewBarangHandler(req, res, next) {
    const {name, code, qty, gudangId} = req.body;
    const errMsg = [];
    if (name) {
        name.length > 100 && errMsg.push("Panjang nama barang melebihi 100 karakter");
    } else {
        errMsg.push("Nama barang diperlukan");
    }
    if (code) {
        code.length > 30 && errMsg.push("Panjang kode barang melebihi 30 karakter");
    } else {
        errMsg.push("Kode barang diperlukan");
    }
    if (qty) {
        if (typeof (qty) !== "number") {
            errMsg.push("Jumlah barang harus berupa angka");
        } else {
            qty < 1 && errMsg.push("Jumlah barang minimal 1");
        }
    } else {
        errMsg.push("Jumlah barang diperlukan");
    }
    if (gudangId) {
        !mongoose.Types.ObjectId.isValid(gudangId) && errMsg.push("Gudang ID tidak valid");
    } else {
        errMsg.push("Gudang ID diperlukan");
    }
    if (!errMsg.length) {
        req.formData = {name, code, qty, gudangId};
        res.json({success: req.formData});
        // next();
    } else {
        res.json({error: errMsg});
    }
}

module.exports = {
    createNewBarangHandler
};