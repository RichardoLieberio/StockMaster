const Gudang = require("../models/Gudang");
const Barang = require("../models/Barang");

async function getAllGudangByUser(req, res) {
    const allGudang = await Gudang.find({userId: req.userData._id});
    res.json({success: "Berhasil mendapatkan semua gudang", allGudang});
}

async function createNewGudang(req, res) {
    const gudang = await Gudang.create({...req.formData, userId: req.userData._id});
    res.json({success: "Berhasil membuat gudang baru", gudang});
}

async function getGudangData(req, res) {
    const gudang = await Gudang.findOne({_id: req.params.id, userId: req.userData._id}).select("_id name totalItems updatedAt");
    !!gudang ? res.json({success: "Gudang ditemukan", gudang}) : res.json({error: "Gudang tidak ditemukan"});
}

async function getAllBarangByGudang(req, res) {
    const allBarang = await Barang.find({gudangId: req.params.id, userId: req.userData._id});
    res.json({success: "Berhasil mendapatkan semua barang", allBarang});
}

async function updateGudangData(req, res) {
    const gudang = await Gudang.findOne({_id: req.params.id, userId: req.userData._id});
    if (!!gudang) {
        if (req.formData.name !== gudang.name) {
            const allGudang = await Gudang.find({userId: req.userData._id});
            const allNames = allGudang.reduce(function (acc, obj) {
                acc.push(obj.name);
                return acc;
            }, []);
            if (!allNames.includes(req.formData.name)) {
                const updatedGudang = await Gudang.findByIdAndUpdate(req.params.id, {...req.formData, userId: req.userData._id}, {new: true, runValidators: true});
                res.json({success: "Berhasil memperbarui data gudang", gudang: updatedGudang});
            } else {
                res.json({error: ["Nama gudang sudah ada"]});
            }
        } else {
            res.json({error: "Tidak ada data yang berubah"});
        }
    } else {
        res.json({error: "Gudang tidak ditemukan"});
    }
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