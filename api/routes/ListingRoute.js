import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../Controller/ListingController.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/getListing/:id", getListing);
router.get("/getListing", getListings);

export default router;
