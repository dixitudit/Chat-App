import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chatRoute from "./routes/ChatRoute.js";
import authRoute from "./routes/AuthRoute.js";

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB connected");
});

const app = express();

app.use(express.json());
app.use("/auth", authRoute);
app.use("/chat", chatRoute);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
