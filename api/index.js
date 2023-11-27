import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userROuter.js";
import authRouter from "./routes/AuthRoute.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/ListingRoute.js";
import path from "path";
dotenv.config();
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log(error);
  });
const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("port is listening at 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.js"));
});
// ceate middle ware for error server
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "internal server error";
  return res.status(statusCode).json({
    message: errMessage,
    success: false,
    statusCode: statusCode,
  });
});
// to use the middle ware use the next in the call back
