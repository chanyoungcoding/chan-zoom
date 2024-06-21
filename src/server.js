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


httpServer.listen(3000, handleListen)