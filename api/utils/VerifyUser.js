import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(errorHandler(401, "invalid Token"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(401, "cannot verify Token"));
    // we can use this req.user i everywhere to see if the suer is present
    req.user = user;
    next();
  });
};
