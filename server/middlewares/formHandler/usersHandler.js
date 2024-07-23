function userLoginHandler(req, res, next) {
    const {username, pwd, rememberMe} = req.body;
    const errMsg = [];
    !username && errMsg.push("Masukkan username");
    !pwd && errMsg.push("Masukkan password");
    if (!errMsg.length) {
        req.formData = {username: username.toLowerCase(), pwd, rememberMe};
        next();
    } else {
        res.json({error: errMsg});
    }
}

function createNewUserHandler(req, res, next) {
    const {name, username, pwd, role} = req.body;
    const errMsg = [];
    if (name) {
        name.length > 30 && errMsg.push("Panjang nama melebihi 30 karakter");
    } else {
        errMsg.push("Nama diperlukan");
    }
    if (username) {
        username.length > 15 && errMsg.push("Panjang username melebihi 15 karakter");
    } else {
        errMsg.push("Username diperlukan");
    }
    if (pwd) {
        pwd.length < 6 && errMsg.push("Panjang password minimal 6 karakter");
    } else {
        errMsg.push("Password diperlukan");
    }
    if (role) {
        const roleDb= ["admin", "user"];
        !roleDb.includes(role) && errMsg.push("Role tidak diketahui");
    } else {
        errMsg.push("Role diperlukan");
    }
    if (!errMsg.length) {
        req.formData = {name, username: username.toLowerCase(), pwd, role};
        next();
    } else {
        res.json({error: errMsg});
    }
}

function updateUserDataHandler(req, res, next) {
    const _id = req.params.id;
    const {name, username, pwd, role} = req.body;
    const errMsg = [];
    if (name) {
        name.length > 30 && errMsg.push("Panjang nama melebihi 30 karakter");
    } else {
        errMsg.push("Nama diperlukan");
    }
    if (username) {
        username.length > 15 && errMsg.push("Panjang username melebihi 15 karakter");
    } else {
        errMsg.push("Username diperlukan");
    }
    if (pwd) {
        pwd.length < 6 && errMsg.push("Panjang password minimal 6 karakter");
    } else {
        errMsg.push("Password diperlukan");
    }
    if (role) {
        const roleDb= ["admin", "user"];
        !roleDb.includes(role) && errMsg.push("Role tidak diketahui");
    } else {
        errMsg.push("Role diperlukan");
    }
    if (!errMsg.length) {
        req.formData = {_id, name, username: username.toLowerCase(), pwd, role};
        next();
    } else {
        res.json({error: errMsg});
    }
}

module.exports = {
    userLoginHandler,
    createNewUserHandler,
    updateUserDataHandler
};