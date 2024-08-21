import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chatRoute from "./routes/ChatRoute.js";
import authRoute from "./routes/AuthRoute.js";
import messageRoute from "./routes/MessageRoute.js";
import userRoute from "./routes/UserRoute.js";
import cors from "cors";
import path from "path";

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB connected");
});

const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, "client", "build")));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);
app.use("/user", userRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
