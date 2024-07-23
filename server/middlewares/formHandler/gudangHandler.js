function createNewGudangHandler(req, res, next) {
    const {name} = req.body;
    const errMsg = [];
    if (name) {
        name.length > 30 && errMsg.push("Panjang nama gudang melebihi 30 karakter");
    } else {
        errMsg.push("Nama gudang diperlukan");
    }
    if (!errMsg.length) {
        req.formData = {name};
        next();
    } else {
        res.json({error: errMsg});
    }
}

module.exports = {
    createNewGudangHandler,
    updateGudangDataHandler: createNewGudangHandler
};