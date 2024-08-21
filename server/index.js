import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chatRoute from "./routes/ChatRoute.js";
import authRoute from "./routes/AuthRoute.js";
import messageRoute from "./routes/MessageRoute.js";
import userRoute from "./routes/UserRoute.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http"; //for merging socket logic and express logic into a single server for easy deployment
import path from "path";

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB connected");
});

const __dirname = path.resolve();

const app = express();

const server = http.createServer(app);

// socket.io logic
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://chat-app-2gnu.onrender.com",
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-origin requests
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from allowed origins
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  console.log("chl rha h 8800 pe");
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  // add chat to receiver if online
  socket.on("add-chat", (receiverId) => {
    console.log("add chat called" + receiverId);
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      console.log("userOnline");
      io.to(user.socketId).emit("add-chat");
      io.emit("get-users", activeUsers);
    }
  });

  socket.on("custom-disconnect", (userId) => {
    activeUsers = activeUsers.filter((user) => user.userId !== userId);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });
});

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

// running both socket and express on 5000
server.listen(5000, () => {
  console.log("server is running on port 5000");
});
