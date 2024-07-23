function isAdmin(req, res, next) {
    if (req.userData) {
        req.userData.role === "admin" ? next() : res.json({error: "Anda tidak memiliki izin"});
    } else {
        res.json({authError: "Autentikasi diperlukan"});
    }
}

module.exports = isAdmin;