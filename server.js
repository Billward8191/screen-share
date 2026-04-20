const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("Joined room:", room);
  });

  socket.on("offer", ({ room, offer }) => {
    socket.to(room).emit("offer", offer);
  });

  socket.on("answer", ({ room, answer }) => {
    socket.to(room).emit("answer", answer);
  });

  socket.on("candidate", ({ room, candidate }) => {
    socket.to(room).emit("candidate", candidate);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});