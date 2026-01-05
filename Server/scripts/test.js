const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected:", socket.id);
  socket.emit("ping");
});

socket.on("pong", (d) => console.log("pong:", d));
socket.on("note_created", (note) => console.log("note_created:", note));
