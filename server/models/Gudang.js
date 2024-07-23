const mongoose = require("mongoose");

const gudangSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: [30, "Panjang nama gudang melebihi 30 karakter"],
        required: [true, "Nama gudang diperlukan"],
        validate: {
            validator: async function (name) {
                const allGudang = await mongoose.model("Gudang").find({userId: this.userId});
                const allNames = allGudang.reduce(function (acc, obj) {
                    acc.push(obj.name);
                    return acc;
                }, []);
                return !allNames.includes(name);
            },
            message: "Nama gudang sudah ada"
        }
    },
    totalItems: {
        type: Number,
        min: [0, "Total barang minimal 0"],
        default: 0,
        required: [true, "Total barang diperlukan"]
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

const Gudang = new mongoose.model("Gudang", gudangSchema);

module.exports = Gudang;