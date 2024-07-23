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
        const {iat, exp, ...data} = jwt.verify(refreshToken, process.env.REFRESH_JWT);
        const newAccessToken = jwt.sign(data, process.env.ACCESS_JWT, {expiresIn: "15m"});
        res.json({token: newAccessToken});
    } catch (error) {
        if (error.name === "TypeError") {
            res.json({authError: "Token tidak tersedia"});
        } else if (error.name === "TokenExpiredError") {
            res.json({authError: "Token kedaluarsa"});
        } else if (error.name === "JsonWebTokenError") {
            res.json({authError: "Format token tidak sesuai"});
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