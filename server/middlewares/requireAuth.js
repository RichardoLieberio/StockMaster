const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(accessToken, process.env.ACCESS_JWT);
        req.userData = data;
        next();
    } catch (error) {
        createAccessToken(req, res);
    }
}

function createAccessToken(req, res) {
    try {
        const refreshToken = req.cookies[process.env.REFRESH_TOKEN];
        if (refreshToken) {
            const {iat, exp, ...user} = jwt.verify(refreshToken, process.env.REFRESH_JWT);
            const newAccessToken = jwt.sign(user, process.env.ACCESS_JWT, {expiresIn: "15m"});
            res.json({token: newAccessToken, user});
        } else {
            res.json({authError: "Anda belum ter-autentikasi"});
        }
    } catch (error) {
        if (error.name === "TypeError") {
            res.json({authError: "Token tidak tersedia"});
        } else if (error.name === "TokenExpiredError") {
            res.json({authError: "Token kedaluarsa"});
        } else if (error.name === "JsonWebTokenError") {
            res.json({authError: "Sesi anda telah berakhir"});
        } else if (error.name === "InternalError") {
            res.json({authError: "Error internal"});
        } else {
            res.json({authError: capitalizeFirstLetter(error.message)});
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = requireAuth;