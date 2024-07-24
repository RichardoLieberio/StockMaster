const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = require("../models/Users");

async function userLogin(req, res) {
    const user = await Users.findOne({username: req.formData.username}).select("_id name username pwd role").lean();
    if (user) {
        const validPwd = await bcrypt.compare(req.formData.pwd, user.pwd);
        if (validPwd) {
            delete user.pwd;
            const refreshToken = jwt.sign(user, process.env.REFRESH_JWT, {expiresIn: req.formData.rememberMe ? "30d" : "1h"});
            const accessToken = jwt.sign(user, process.env.ACCESS_JWT, {expiresIn: "15m"});
            res.cookie(process.env.REFRESH_TOKEN, refreshToken, {
                maxAge: req.formData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict"
            });
            res.json({success: "User ditemukan", token: accessToken});
        } else {
            res.json({error: "Username dan password tidak sesuai"});
        }
    } else {
        res.json({error: "Username dan password tidak sesuai"});
    }
}

async function getAllUser(req, res) {
    const allUsers = await Users.find({});
    res.json({success: "Berhasil mendapatkan semua user", allUsers});
}

async function createNewUser(req, res) {
    const salt = await bcrypt.genSalt(12);
    req.formData.pwd = await bcrypt.hash(req.formData.pwd, salt);
    const user = await Users.create(req.formData);
    res.json({success: "Berhasil mendaftarkan user baru", user});
}

async function getUserData(req, res) {
    const user = await Users.findById(req.params.id).select("_id name username role");
    !!user ? res.json({success: "User ditemukan", user}) : res.json({error: "User tidak ditemukan"});
}

async function updateUserData(req, res) {
    if (req.formData.pwd) {
        const salt = await bcrypt.genSalt(12);
        req.formData.pwd = await bcrypt.hash(req.formData.pwd, salt);
    }
    const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.formData, {new: true, runValidators: true});
    res.json({success: "Berhasil memperbarui data user", user: updatedUser});
}

async function deleteUser(req, res) {
    const user = await Users.findByIdAndDelete(req.params.id);
    !!user ? res.json({success: "Berhasil menghapus user", user}) : res.json({error: "User tidak ditemukan"});
}

module.exports = {
    userLogin,
    getAllUser,
    createNewUser,
    getUserData,
    updateUserData,
    deleteUser
};