const jwt = require("jsonwebtoken");

function logoutRequired(req, res, next) {
    if (req.cookies[process.env.REFRESH_TOKEN]) {
        try {
            jwt.verify(req.cookies[process.env.REFRESH_TOKEN], process.env.REFRESH_JWT);
            res.json({error: "Anda sudah ter-autentikasi"});
        } catch (error) {
            next();
        }
    } else {
        next();
    }
}

module.exports = logoutRequired;