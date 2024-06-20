// import WebSocket from "ws";
import http from "http";
import express from "express"; 
import { Server } from "socket.io";

// 새로고침 하지 않아도 자동으로 변경사항 반영
import livereloadMiddleware from "connect-livereload";
import livereload from "livereload";

const app = express();

const liveServer = livereload.createServer({
  exts: ["js", "pug", "css"],
  delay: 500,
});

liveServer.watch(__dirname);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.use(livereloadMiddleware());

app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", socket => {

  socket["nickname"] = "Anon";

  // 해당 방에 유저가 들어올 때
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName)
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  })

  // 해당 방에 유저가 나갈 때
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  })

  // 해당 방에 새로운 메시지 추가
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  })

  // 닉네임
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
})






//* WebSocket

// const wss = new WebSocket.Server({server});

// const sockets = []

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser ✅");
//   socket.on("close", () => console.log("close Socket"));

//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);

//     switch (message.type) {

//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//         break;

//       case "nickname":
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// });

httpServer.listen(3000, handleListen)