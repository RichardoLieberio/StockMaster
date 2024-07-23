const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: [30, "Panjang nama melebihi 30 karakter"],
        required: [true, "Nama diperlukan"]
    },
    username: {
        type: String,
        maxlength: [15, "Panjang username melebihi 15 karakter"],
        unique: true,
        required: [true, "Username diperlukan"],
        validate: {
            validator: async function (username) {
                const user = await mongoose.model("Users").findOne({username: username.toLowerCase()});
                return !user;
            },
            message: "Username telah terdaftar"
        }
    },
    pwd: {
        type: String,
        minlength: [6, "Panjang password minimal 6 karakter"],
        required: [true, "Password diperlukan"]
    },
    role: {
        type: String,
        enum: {
            values: ["admin", "user"],
            message: "Role tidak diketahui"
        },
        default: "user",
        required: [true, "Role diperlukan"]
    }
}, { timestamps: true });

userSchema.pre("save", function (next) {
    this.username = this.username.toLowerCase();
    next();
});

userSchema.pre("findOneAndUpdate", function (next) {
    const updatedData = this.getUpdate();
    if (updatedData.username) {
        updatedData.username = updatedData.username.toLowerCase();
    }
    next();
});

const Users = new mongoose.model("Users", userSchema);

module.exports = Users;