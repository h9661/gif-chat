# study notes

## 1. ws socket states

- `CONNECTING`
- `OPEN`
- `CLOSING`
- `CLOSED`

when only and only if the state is OPEN, the socket can send and receive messages.

## 2. `const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress`

- `req.headers['x-forwarded-for']` is the ip address of the client
- `req.connection.remoteAddress` is the ip address of the server

## 3. `connect-flash`

- `connect-flash` is a middleware that stores messages in session and then deletes them after they are displayed to the user. It is useful for displaying error messages.

example:

```js
app.get("/login", (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render("login", { errorMessage });
});

app.post("/login", (req, res) => {
  req.flash("error", "로그인에 실패했습니다.");
  res.redirect("/login");
});
```

## 4. web broswer can use WebSocket API to create a WebSocket client whitout import library

example:

```js
const ws = new WebSocket("ws://localhost:3000");
ws.onopen = () => {
  ws.send("Hello!");
};
```

## 5. how to set ws server socket to SO_REUSEADDR

```js
const WebSocket = require("ws");
const websocketPort = 8080;

const serverOptions = {
  port: websocketPort,
  backlog: 1024, // maximum length of the queue of pending connections
};

const wss = new WebSocket.Server(serverOptions);

wss.on("connection", (ws) => {});
```

## 6. ws.send() can send string, buffer, arraybuffer, blob, object

## 7. polling vs SSE(Server Sent Event) vs WebSocket

- polling: client sends request to server periodically to check if there is new data.

  - use http protocol

- SSE: server sends data to client periodically if there is new data.

  - use http protocol

- WebSocket: client and server can send data to each other at any time.
  - use ws protocol

## socket.io

https://poiemaweb.com/nodejs-socketio

## ubuntu mongodb 설치 후 연결하기

notion에 정리함

## 네임스페이스

```js
const socket = io.connect("http://localhost:3000/room", {
  // 네임스페이스
  path: "/socket.io",
});

const io = SocketIO(server, { path: "/socket.io" });
app.set("io", io);
const room = io.of("/room");
const chat = io.of("/chat");
```

여기서 /room이란 네임스페이스를 뜻한다. 네임스페이스는 서버에서 socket.io를 사용할 때, 특정 경로를 지정해주는 것이다. 이렇게 하면 클라이언트에서도 해당 경로로 접속할 수 있다.
`io.of()`를 통해 네임스페이스에 해당하는 소켓 객체를 가져올 수 있다.

## html5 데이터셋

https://blogpack.tistory.com/680

## session middleware

```js
chat.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});
```

이 부분을 공부하며 생겼던 의문과 내 결론을 정리해보자.

session({options})는 해당 option을 가진 session middleware를 리턴한다.
이후 그 이후 리턴한 미들웨어(req, res, next)를 하면 req에 session이 추가된다.
아주 쉽죠? ㅋ

## socket.to

GitHub Copilot: `socket.to`는 Socket.IO에서 사용되는 메소드 중 하나입니다. 이 메소드는 특정한 방(room)에 속한 클라이언트들에게 메시지를 보낼 때 사용됩니다.

`socket.to(room).emit(event, data)`와 같은 형태로 사용됩니다. 여기서 `room`은 방의 이름이며, `event`는 보내고자 하는 이벤트의 이름, `data`는 이벤트와 함께 보내고자 하는 데이터입니다.

예를 들어, `socket.to('room1').emit('message', 'Hello, room1!')`는 'room1'이라는 방에 속한 클라이언트들에게 'message'라는 이벤트와 함께 'Hello, room1!'이라는 데이터를 보냅니다.

`socket.to`는 `socket.emit`과 달리, 특정한 방에 속한 클라이언트들에게만 메시지를 보내는 것이 가능합니다. 이를 통해, 특정한 그룹의 클라이언트들에게만 메시지를 보내는 것이 가능해집니다.
