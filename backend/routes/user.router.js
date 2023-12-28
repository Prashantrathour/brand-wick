const express = require("express");
const { registerController, loginController, logoutController } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/register", registerController.registerUser);
userRouter.post("/login", loginController.loginUser);
userRouter.post("/logout", logoutController.logoutUser);

module.exports = {
  userRouter
};