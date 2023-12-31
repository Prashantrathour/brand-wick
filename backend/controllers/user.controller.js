const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const registerController = {
  registerUser: async (req, res) => {
    const { name, username, email, password, phonenumber } = req.body;

    try {
      let userExist = await UserModel.findOne({ email });

      if (userExist) {
        return res.status(400).json({
          msg: "Email already exists, please login or signup with another email",
          state: true,
        });
      }

      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!/^[a-zA-Z ]*$/.test(name)) {
          return res.status(400).json({ msg: "Invalid Name!" });
        } else if (!/^[a-zA-Z ]*$/.test(username)) {
          return res.status(400).json({ msg: "Invalid username!" });
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
          return res.status(400).json({ msg: "Invalid emailId!" });
        } else if (
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
            password
          )
        ) {
          return res.status(400).json({
            msg: "Password should contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, and minimum length should be 8!",
          });
        }

        const user = new UserModel({
          name,
          username,
          email,
          phonenumber,
          password: hash,
        });

        try {
          await user.save();
          res.json({ msg: "New user registered" });
        } catch (saveError) {
          if (saveError.code === 11000) {
            return res.status(400).json({
              msg: "Email is already registered. Please use a different email.",
            });
          }
          console.log(saveError);
          return res.status(500).json({ msg: "Internal server error" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },
};

const loginController = {
  loginUser: async (req, res) => {
    let { email, password } = req.body;
email=email.toLowerCase()
    if (email && password) {
      try {
        const user = await UserModel.findOne({ email });
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              // Generate access token with expiry time
              const accessToken = jwt.sign(
                { userID: user._id, user: user.firstName },
                process.env.secret,
                { expiresIn: "1h" } // Set the expiry time, e.g., 1 hour
              );

              // Generate refresh token
              const refreshToken = jwt.sign(
                { userID: user._id, user: user.firstName },
                process.env.refreshSecret,
                { expiresIn: "7d" } // Set the expiry time for refresh token, e.g., 7 days
              );

              // Set the refresh token as an HttpOnly cookie with expiration
              res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
              });

              // Set the access token as an HttpOnly cookie with expiration
              res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
              });

              // Send the access token and user details in the response
              token=accessToken
              res.status(200).json({
                msg: "Logged In!",
                token,
                refreshToken,
                user: user.name,
              });
            } else {
              res.status(400).json({ msg: "Wrong Credentials" });
            }
          });
        } else {
          res.status(400).json({
            msg: "User does not exist. Please Register first",
            newuser: true,
          });
        }
      } catch (err) {
        res.status(400).json({ msg: err.message });
      }
    } else {
      res
        .status(404)
        .json({ msg: `Please enter - ${!email ? "email" : "password"}` });
    }
  },
};

const logoutController = {
  logoutUser: (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ msg: "Logged out successfully" });
  },
};

module.exports = {
  registerController,
  loginController,
  logoutController,
};
