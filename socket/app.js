import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  },
});

let onlineUsers = [];

// ADD USER
const addUser = (userId, socketId) => {
  onlineUsers = onlineUsers.filter(
    (user) => user.socketId !== socketId
  );

  const exists = onlineUsers.find(
    (user) =>
      user.userId === userId &&
      user.socketId === socketId
  );

  if (!exists) {
    onlineUsers.push({
      userId,
      socketId,
    });
  }
};

// REMOVE USER
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(
    (user) => user.socketId !== socketId
  );
};

// GET USER SOCKETS
const getUsers = (userId) => {
  return onlineUsers.filter(
    (user) => user.userId === userId
  );
};

io.on("connection", (socket) => {
  // REGISTER USER
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  // SEND MESSAGE
  socket.on(
    "sendMessage",
    ({ receiverId, data }) => {
      const receivers = getUsers(receiverId);

      receivers.forEach((receiver) => {
        io.to(receiver.socketId).emit(
          "getMessage",
          data
        );
      });
    }
  );

  // DISCONNECT USER
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

const PORT = process.env.PORT || 4000

io.listen(PORT);

console.log(`Socket server running on port ${PORT}`);