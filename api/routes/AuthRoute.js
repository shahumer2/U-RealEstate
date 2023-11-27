import express from "express";
import {
  AuthController,
  google,
  signin,
  signoutUser,
} from "../Controller/AuthUserController.js";

const router = express.Router();

router.post("/signup", AuthController);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signoutUser);

export default router;
