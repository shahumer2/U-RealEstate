import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import Listing from "../models/ListingModel.js";

/* export const test = (req, res) => {
  res.json({ message: "heybro" });
}; */

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler("403", "unauthorized access"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    // we have used the set method to only set those values which we want if w eput blank some values it wont affect anytrhng
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, "error while updating"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you cannot delete another acc"));
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.clearCookie("accessToken");
    return res.status(200).json("user deleted successfully");
  } catch (error) {
    next(errorHandler(error));
  }
};

export const userListing = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      const listing = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listing);
    } else {
      next(errorHandler(401, "you can onlu see your lsiting"));
    }
  } catch (error) {}
};
export const getUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "user not found"));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(404, "no user"));
  }
};
