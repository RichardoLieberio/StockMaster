const mongoose = require("mongoose");

const barangSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: [100, "Panjang nama barang melebihi 100 karakter"],
        required: [true, "Nama barang diperlukan"]
    },
    code: {
        type: String,
        maxlength: [30, "Panjang kode barang melebihi 30 karakter"],
        required: [true, "Kode barang diperlukan"]
    },
    qty: {
        type: Number,
        min: [1, "Jumlah barang minimal 1"],
        default: 1,
        required: [true, "Jumlah barang diperlukan"]
    },
    gudangId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gudang",
        required: [true, "Gudang ID diperlukan"],
        validate: {
            validator: async function (id) {
                const gudang = await mongoose.model("Gudang").findById(id);
                return !!gudang;
            },
            message: "Gudang ID tidak ditemukan"
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "User ID diperlukan"],
        validate: {
            validator: async function (id) {
                const user = await mongoose.model("Users").findById(id);
                return !!user;
            },
            message: "User ID tidak ditemukan"
        }
    }
}, { timestamps: true });

const Barang = new mongoose.model("Barang", barangSchema);

module.exports = Barang;