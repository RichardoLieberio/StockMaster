const Gudang = require("../models/Gudang");
const Barang = require("../models/Barang");

async function getAllGudangByUser(req, res) {
    const allGudang = await Gudang.find({userId: req.userData._id});
    res.json({success: "Berhasil mendapatkan semua gudang", allGudang});
}

async function createNewGudang(req, res) {
    const gudang = await Gudang.create(req.gudangData);
    res.json({success: "Berhasil membuat gudang baru", gudang});
}

async function getGudangData(req, res) {
    const gudang = await Gudang.findOne({_id: req.params.id, userId: req.userData._id}).select("_id name totalItems updatedAt");
    !!gudang ? res.json({success: "Gudang ditemukan", gudang}) : res.json({error: "Gudang tidak ditemukan"});
}

async function getAllBarangByGudang(req, res) {
    const allBarang = await Barang.find({gudangId: req.params.id, userId: req.userData._id}).select("_id name code qty");
    res.json({success: "Berhasil mendapatkan semua barang", allBarang});
}

async function updateGudangData(req, res) {
    const updatedGudang = await Gudang.findByIdAndUpdate(req.params.id, req.gudangData, {new: true, runValidators: true});
    res.json({success: "Berhasil memperbarui data gudang", gudang: updatedGudang});
}

async function deleteGudang(req, res) {
    const gudang = await Gudang.findOneAndDelete({_id: req.params.id, userId: req.userData._id});
    !!gudang ? res.json({success: "Berhasil menghapus gudang", gudang}) : res.json({error: "Gudang tidak ditemukan"});
}

module.exports = {
    getAllGudangByUser,
    createNewGudang,
    getGudangData,
    getAllBarangByGudang,
    updateGudangData,
    deleteGudang
};