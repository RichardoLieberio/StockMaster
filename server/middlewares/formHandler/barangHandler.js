const mongoose = require("mongoose");

const Gudang = require("../../models/Gudang");
const Barang = require("../../models/Barang");

async function createNewBarangHandler(req, res, next) {
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
        if (typeof qty === "number") {
            qty < 1 && errMsg.push("Jumlah barang minimal 1");
        } else {
            errMsg.push("Jumlah barang harus berupa angka");
        }
    } else {
        errMsg.push("Jumlah barang diperlukan");
    }
    if (gudangId) {
        const isValidId = mongoose.Types.ObjectId.isValid(gudangId);
        if (isValidId) {
            const gudang = await Gudang.findById(gudangId);
            if (gudang) {
                const barang = await Barang.findOne({name, code, gudangId, userId: req.userData._id});
                !!barang && errMsg.push("Barang dengan nama dan kode tersebut sudah ada");
            } else {
                errMsg.push("Gudang ID tidak ditemukan");
            }
        } else {
            errMsg.push("Gudang ID tidak valid");
        }
    } else {
        errMsg.push("Gudang ID diperlukan");
    }
    if (!errMsg.length) {
        req.barangData = {name, code, qty, gudangId, userId: req.userData._id};
        next();
    } else {
        res.json({error: errMsg});
    }
}

async function updateBarangDataHandler(req, res, next) {
    const barang = await Barang.findById(req.params.id);
    if (barang) {
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
            if (typeof qty === "number") {
                qty < 1 && errMsg.push("Jumlah barang minimal 1");
            } else {
                errMsg.push("Jumlah barang harus berupa angka");
            }
        } else {
            errMsg.push("Jumlah barang diperlukan");
        }
        if (gudangId) {
            const isValidId = mongoose.Types.ObjectId.isValid(gudangId);
            if (isValidId) {
                const gudang = await Gudang.findById(gudangId);
                if (gudang) {
                    const findBarang = await Barang.findOne({_id: {$ne: req.params.id}, name, code, gudangId, userId: req.userData._id});
                    !!findBarang && errMsg.push("Barang dengan nama dan kode tersebut sudah ada");
                } else {
                    errMsg.push("Gudang ID tidak ditemukan");
                }
            } else {
                errMsg.push("Gudang ID tidak valid");
            }
        } else {
            errMsg.push("Gudang ID diperlukan");
        }
        if (!errMsg.length) {
            req.barangData = {name, code, qty, gudangId};
            req.barangData.name === barang.name && delete req.barangData.name;
            req.barangData.code === barang.code && delete req.barangData.code;
            req.barangData.qty === barang.qty && delete req.barangData.qty;
            req.barangData.gudangId === barang.gudangId.toString() && delete req.barangData.gudangId;
            Object.keys(req.barangData).length ? next() : res.json({error: "Tidak ada data yang berubah"});
        } else {
            res.json({error: errMsg});
        }
    } else {
        res.json({error: "Barang tidak ditemukan"});
    }
}

module.exports = {
    createNewBarangHandler,
    updateBarangDataHandler
};