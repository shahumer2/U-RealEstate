import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const AuthController = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "user Created Sucessfully" });
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await UserModel.findOne({ email });
    if (!validUser) return next(errorHandler(500, "Email Not Found"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(501, "invalid credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json({ ...rest });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("accessToken", token, { httpOnly: true })
        .status(200)
        .json({ ...rest });
    } else {
      const generatedPassword = Math.random().toString().slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const user = new UserModel({
        username: req.body.name.split(" ").join("").toLowerCase(),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("accessToken", token, { httpOnly: true })
        .status(200)
        .json({ ...rest });
      res.status(201).json({ message: "user Created Sucessfully" });
    }
  } catch (error) {
    next(error);
  }
};
export const signoutUser = (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json("userdeleted successfully");
  } catch (error) {
    next(error);
  }
};
