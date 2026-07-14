import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
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
  console.log("User connected:", socket.id);

  // REGISTER USER
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);

    console.log("Online users:", onlineUsers);
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

    console.log(
      "User disconnected:",
      socket.id
    );

    console.log(
      "Online users:",
      onlineUsers
    );
  });
});

io.listen(4000);

console.log("Socket server running on port 4000");