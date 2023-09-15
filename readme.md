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
