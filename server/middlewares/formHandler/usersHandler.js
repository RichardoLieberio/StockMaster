const bcrypt = require("bcrypt");

const Users = require("../../models/Users");

function userLoginHandler(req, res, next) {
    const {username, pwd, rememberMe} = req.body;
    const errMsg = [];
    !username && errMsg.push("Masukkan username");
    !pwd && errMsg.push("Masukkan password");
    if (!errMsg.length) {
        req.formData = {username, pwd, rememberMe};
        next();
    } else {
        res.json({formError: errMsg});
    }
}

async function createNewUserHandler(req, res, next) {
    const {name, username, pwd, role} = req.body;
    const errMsg = [];
    if (name) {
        name.length > 30 && errMsg.push("Panjang nama melebihi 30 karakter");
    } else {
        errMsg.push("Nama diperlukan");
    }
    if (username) {
        if (username.length > 15) {
            errMsg.push("Panjang username melebihi 15 karakter");
        } else {
            const user = await Users.findOne({username});
            user && errMsg.push("Username telah terdaftar");
        }
    } else {
        errMsg.push("Username diperlukan");
    }
    if (pwd) {
        pwd.length < 6 && errMsg.push("Panjang password minimal 6 karakter");
    } else {
        errMsg.push("Password diperlukan");
    }
    if (role) {
        const roles= ["admin", "user"];
        !roles.includes(role) && errMsg.push("Role tidak diketahui");
    } else {
        errMsg.push("Role diperlukan");
    }
    if (!errMsg.length) {
        req.formData = {name, username, pwd, role};
        res.json({success: req.formData});
        // next();
    } else {
        res.json({error: errMsg});
    }
}

async function updateUserDataHandler(req, res, next) {
    const user = await Users.findById(req.params.id);
    if (user) {
        const {name, username, pwd, role} = req.body;
        const errMsg = [];
        if (name) {
            name.length > 30 && errMsg.push("Panjang nama melebihi 30 karakter");
        } else {
            errMsg.push("Nama diperlukan");
        }
        if (username) {
            if (username.length > 15) {
                errMsg.push("Panjang username melebihi 15 karakter");
            } else {
                const user = await Users.findOne({username, _id: {$ne: req.params.id}});
                user && errMsg.push("Username telah terdaftar");
            }
        } else {
            errMsg.push("Username diperlukan");
        }
        if (pwd) {
            pwd.length < 6 && errMsg.push("Panjang password minimal 6 karakter");
        } else {
            errMsg.push("Password diperlukan");
        }
        if (role) {
            const roles= ["admin", "user"];
            !roles.includes(role) && errMsg.push("Role tidak diketahui");
        } else {
            errMsg.push("Role diperlukan");
        }
        if (!errMsg.length) {
            req.formData = {name, username, pwd, role};
            req.formData.name === user.name && delete req.formData.name;
            req.formData.username.toLowerCase() === user.username && delete req.formData.username;
            req.formData.role === user.role && delete req.formData.role;
            const isPwdNotChanges= await bcrypt.compare(req.formData.pwd, user.pwd);
            isPwdNotChanges && delete req.formData.pwd;
            Object.keys(req.formData).length ? next() : res.json({error: "Tidak ada data yang berubah"});
        } else {
            res.json({error: errMsg});
        }
    } else {
        res.json({error: "User tidak ditemukan"});
    }
}

module.exports = {
    userLoginHandler,
    createNewUserHandler,
    updateUserDataHandler
};