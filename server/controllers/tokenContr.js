const jwt = require("jsonwebtoken");

function createAccessToken(req, res) {
    try {
        const refreshToken = req.cookies[process.env.REFRESH_TOKEN];
        if (refreshToken) {
            const {iat, exp, ...user} = jwt.verify(refreshToken, process.env.REFRESH_JWT);
            const newAccessToken = jwt.sign(user, process.env.ACCESS_JWT, {expiresIn: "15m"});
            res.json({token: newAccessToken, user});
        } else {
            res.json({error: "Anda belum ter-autentikasi"});
        }
    } catch (error) {
        res.json({authError: "Sesi telah berakhir"});
    }
}

module.exports = {
    createAccessToken
};