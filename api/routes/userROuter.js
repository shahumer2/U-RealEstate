import express from "express";
import {
  deleteUser,
  updateUser,
  userListing,
  getUser,
} from "../Controller/UserController.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.post("/updateUser/:id", verifyToken, updateUser);
router.delete("/deleteUser/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, userListing);
router.get("/:id", verifyToken, getUser);

export default router;
