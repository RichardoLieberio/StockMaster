const Barang = require("../models/Barang");

async function createNewBarang(req, res) {
    const barang = await Barang.create({...req.body, userId: req.userData._id});
    res.json({success: "Berhasil membuat barang baru", barang});
}

async function getBarangData(req, res) {
    const barang = await Barang.findOne({_id: req.params.id, userId: req.userData._id}).select("_id name code qty gudangId updatedAt");
    !!barang ? res.json({success: "Barang ditemukan", barang}) : res.json({error: "Barang tidak ditemukan"});
}

async function updateBarangData(req, res) {
    const barang = await Barang.findOne({_id: req.params.id, userId: req.userData._id}).select("_id code");
    if (!!barang) {
        const updatedBarang = await Barang.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.json({success: "Berhasil memperbarui data barang", barang: updatedBarang});
    } else {
        res.json({error: "Barang tidak ditemukan"});
    }
}

async function deleteBarang(req, res) {
    const barang = await Barang.findOneAndDelete({_id: req.params.id, userId: req.userData._id});
    !!barang ? res.json({success: "Berhasil menghapus barang", barang}) : res.json({error: "Barang tidak ditemukan"});
}

module.exports = {
    createNewBarang,
    getBarangData,
    updateBarangData,
    deleteBarang
};