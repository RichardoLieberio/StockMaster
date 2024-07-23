const express = require("express");

const logoutRequired = require("../middlewares/logoutRequired");
const requireAuth = require("../middlewares/requireAuth");
const isAdmin = require("../middlewares/isAdmin");
const isValidId = require("../middlewares/isValidId");
const errorHandler = require("../middlewares/errorHandler");
const handler = require("../middlewares/formHandler/usersHandler");

const contr = require("../controllers/usersContr");

const router = express.Router();

//Login user
router.post("/login", logoutRequired, handler.userLoginHandler, errorHandler(contr.userLogin));

router.use(requireAuth);
router.use(isAdmin);

//Get all user
router.get("/", errorHandler(contr.getAllUser));

//Create new user
router.post("/", handler.createNewUserHandler, errorHandler(contr.createNewUser));

//Get user data
router.get("/:id", isValidId, errorHandler(contr.getUserData));

//Update user data
router.patch("/:id", isValidId, handler.updateUserDataHandler, errorHandler(contr.updateUserData));

//Delete user
router.delete("/:id", isValidId, errorHandler(contr.deleteUser));

module.exports = router;