const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`

  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

const updateMessage = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");

  li.innerText = msg

  ul.appendChild(li) 
}

const handleRoomSubmit = (event) => {
  event.preventDefault();

  const input = form.querySelector("input");

  roomName = input.value

  socket.emit("enter_room", input.value, showRoom);
  
  input.value = ""
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    updateMessage(`You: ${value}`);
  });
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit)

socket.on("welcome", () => {
  updateMessage(`${roomName}  방에 누군가 들어왔습니다.`)
})

socket.on("bye", () => {
  updateMessage("someone out!!")
})

socket.on("new_message", updateMessage)