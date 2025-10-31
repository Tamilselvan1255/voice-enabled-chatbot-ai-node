const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const userRegister = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return res
        .status(400)
        .send({ error: "User with this email already exists!" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await userModel.create({ userName, email, password: hashed });
    return res.status(201).send({ message: "User registration successful" });
  } catch (error) {
    console.error("Error while registering user!", error.message);
    return res.status(500).send({ error: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await userModel.findOne({ email });
    if (!existUser) {
      return res.status(404).send({ error: "User not found!" });
    }

    const decrypted = await bcrypt.compare(password, existUser.password);
    if (!decrypted) {
      return res.status(400).send({ error: "Incorrect credentials!" });
    }

    const token = jwt.sign(
      { userId: existUser._id, email },
      process.env.JWT_SECRET
    );

    return res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    console.error("Error while login", error.message);
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = { userRegister, userLogin };
