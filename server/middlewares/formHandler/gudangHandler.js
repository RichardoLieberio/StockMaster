const Gudang = require("../../models/Gudang");

async function createNewGudangHandler(req, res, next) {
    const {name} = req.body;
    const errMsg = [];
    if (name) {
        if (name.length > 30) {
            errMsg.push("Panjang nama gudang melebihi 30 karakter");
        } else {
            const gudang = await Gudang.findOne({name, userId: req.userData._id});
            gudang && errMsg.push("Nama gudang sudah ada");
        }
    } else {
        errMsg.push("Nama gudang diperlukan");
    }
    if (!errMsg.length) {
        req.gudangData = {name, userId: req.userData._id};
        next();
    } else {
        res.json({error: errMsg});
    }
}

async function updateGudangDataHandler(req, res, next) {
    const gudang = await Gudang.findById(req.params.id);
    if (gudang) {
        const {name} = req.body;
        const errMsg = [];
        if (name) {
            if (name.length > 30) {
                errMsg.push("Panjang nama gudang melebihi 30 karakter");
            } else {
                const gudang = await Gudang.findOne({_id: {$ne: req.params.id}, name, userId: req.userData._id});
                gudang && errMsg.push("Nama gudang sudah ada");
            }
        } else {
            errMsg.push("Nama gudang diperlukan");
        }
        if (!errMsg.length) {
            if (gudang.name !== name) {
                req.gudangData = {name};
                next();
            } else {
                res.json({error: "Tidak ada data yang berubah"});
            }
        } else {
            res.json({error: errMsg});
        }
    } else {
        res.json({error: "Gudang tidak ditemukan"});
    }
}

module.exports = {
    createNewGudangHandler,
    updateGudangDataHandler
};