const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = require("../models/Users");

async function userLogin(req, res) {
    const user = await Users.findOne({username: req.formData.username}).select("_id name username pwd role").lean();
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
}

async function getAllUser(req, res) {
    const allUsers = await Users.find({});
    res.json({success: "Berhasil mendapatkan semua user", allUsers});
}

async function createNewUser(req, res) {
    const salt = await bcrypt.genSalt(12);
    const hashedPwd = await bcrypt.hash(req.formData.pwd, salt);
    const user = await Users.create({...req.formData, pwd: hashedPwd});
    res.json({success: "Berhasil mendaftarkan user baru", user});
}

async function getUserData(req, res) {
    const user = await Users.findById(req.params.id).select("_id name username role");
    !!user ? res.json({success: "User ditemukan", user}) : res.json({error: "User tidak ditemukan"});
}

async function updateUserData(req, res) {
    const user = await Users.findById(req.params.id).select("_id name username pwd role");
    if (!!user) {
        req.formData.name === user.name && delete req.formData.name;
        req.formData.username === user.username && delete req.formData.username;
        req.formData.role === user.role && delete req.formData.role;
        const isPwdNotChanges= await bcrypt.compare(req.formData.pwd, user.pwd);
        if (isPwdNotChanges) {
            delete req.formData.pwd;
        } else {
            const salt = await bcrypt.genSalt(12);
            const hashedPwd = await bcrypt.hash(req.formData.pwd, salt);
            req.formData.pwd = hashedPwd;
        }
        if (Object.keys(req.formData).length > 1) {
            const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.formData, {new: true, runValidators: true});
            res.json({success: "Berhasil memperbarui data user", user: updatedUser});
        } else {
            res.json({error: "Tidak ada data yang berubah"});
        }
    } else {
        res.json({error: "User tidak ditemukan"});
    }
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