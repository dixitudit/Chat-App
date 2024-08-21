import { Server } from "socket.io";

const io = new Server(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
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
