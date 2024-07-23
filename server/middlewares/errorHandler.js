function errorHandler(handler) {
    return async function (req, res) {
        try {
            await handler(req, res);
        } catch (error) {
            if (error.name === "ValidationError") {
                const keys = Object.keys(error.errors);
                const errMsg = [];
                for (let key of keys) {
                    errMsg.push(error.errors[key].message);
                }
                res.json({error: errMsg});
            } else {
                res.json({error: "Error tidak diketahui"});
            }
        }
    }
}

module.exports = errorHandler;