const SocketIO = require("socket.io");

// similar with net module that i've used in boostcamp chanllange.
module.exports = (server) => {
  // path: 클라이언트와 서버가 연결되는 경로를 지정해준다.
  const io = SocketIO(server, { path: "/socket.io" });

  io.on("connection", (socket) => {
    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("새로운 클라이언트 접속!", ip, socket.id, req.ip);

    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", ip, socket.id);
      clearInterval(socket.interval);
    });

    socket.on("error", (error) => {
      console.error(error);
    });

    socket.on("reply", (data) => {
      console.log(data);
    });

    socket.interval = setInterval(() => {
      socket.emit("news", "Hello Socket.IO");
    }, 3000);
  });
};
