import Listing from "../models/ListingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(404, "You aree not allowed"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing deleted");
  } catch (error) {
    return next(error.message);
  }
};
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(401, "listing not found"));
  }
  // req.user.kd is the same id which we have stored in the cookie
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can only hpdate your own listing"));
  }
  try {
    //new:true because if we dont add this it will show us the prev value
    //This option ensures that the updated document is returned after the update operation.
    //If new is set to false or omitted, the function would return the document before the update.
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateListing);
  } catch (error) {
    return next(errorHandler(401, "something went wrong while updating"));
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(401, "listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    return next(error.message);
  }
};
//req.query means in the url localhost://api/user/listing?limit="5"&startIndex="4"
export const getListings = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  let offer = req.query.offer;
  try {
    if (offer === undefined || offer === "false") {
      offer = {
        $in: [true, false],
      };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = {
        $in: [true, false],
      };
    }
    let parking = req.query.furnished;
    if (parking === undefined || parking === "false") {
      parking = {
        $in: [true, false],
      };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = {
        $in: ["rent", "sale"],
      };
    }
    let searchTerm = req.query.searchTerm || "";
    let sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    // regex is built in functionality for the mongo db term in which it will search all the item based on the name we provided
    //$options:"i "means to forgot upper or lower case
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
