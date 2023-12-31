const SocketIO = require("socket.io");
const User = require("./schemas/user");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  const connectedUsers = {};
  const socketToUsername = {};
  const usernameToSocket = {};

  app.set("io", io);
  app.set("connectedUsers", connectedUsers);
  app.set("socketToUsername", socketToUsername);
  app.set("usernameToSocket", usernameToSocket);

  const room = io.of("/room");
  const chat = io.of("/chat");

  // 모든 웹 소켓 연결 시마다 실행
  // socket.request: 요청 객체에 접근 가능
  // socket.request.res: 응답 객체에 접근 가능
  chat.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on("connection", (socket) => {
    console.log("room 네임스페이스에 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스에 접속");
    // userId로 DB에서 사용자 정보를 가져온다.

    socket.on("join", async (data) => {
      const userId = socket.request.session.passport?.user;
      let tempUser = await User.findOne({ _id: userId });
      connectedUsers[socket.request.session.passport.user] = socket.id;
      socketToUsername[socket.id] = tempUser.username;
      usernameToSocket[tempUser.username] = socket.id;

      // data는 브라우저에서 보낸 방 아이디
      socket.join(data); // join(id): 방 아이디에 들어가는 메서드
      // to(id).emit("join", ...): 특정 방에 데이터를 보내는 메서드
      socket.to(data).emit("join", {
        user: "system",
        chat: `${tempUser.username}님이 입장하셨습니다.`,
        userCount: socket.adapter.rooms.get(data).size,
      });
    });

    socket.on("kickUser", (data) => {
      let socketId = usernameToSocket[data];

      socket.to(socketId).emit("kick", {
        message: "방장에 의해 강퇴되었습니다.",
      });
    });

    socket.on("getUserList", (data) => {
      socket.emit("postUserList", {
        userList: usernameToSocket,
      });
    });

    socket.on("dm-request", (data) => {
      let socketId = usernameToSocket[data.id];

      socket.to(socketId).emit("dm", {
        user: data.user,
        username: data.username,
        color: data.color,
        chat: data.chat,
        gif: data.gif,
      });
    });

    socket.on("disconnect", async () => {
      let userId = socket.request.session.passport?.user;
      const tempUser = await User.findOne({ _id: userId });

      delete connectedUsers[socket.request.session.passport.user];
      delete socketToUsername[socket.id];
      delete usernameToSocket[tempUser.username];
      console.log("chat 네임스페이스 접속 해제");
      const { referer } = socket.request.headers; // referer: 이전 페이지의 주소
      const roomId = referer.split("/").at(-1); // 방 아이디 추출
      socket.leave(roomId); // leave(id): 방 아이디에서 나가는 메서드
      const currentRoom = socket.adapter.rooms.get(roomId);
      const userCount = currentRoom ? currentRoom.size : 0;

      if (userCount == 0) {
        fetch(`http://localhost:3000/room/${roomId}`, {
          method: "DELETE",
        })
          .then(() => {
            room.emit("removeRoom", roomId);
            console.log("방 제거 요청 성공");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${tempUser.username}님이 퇴장하셨습니다.`,
          userCount: socket.adapter.rooms.get(roomId).size,
        });
      }
    });

    socket.on("chat", (data) => {
      socket.to(data.room).emit("chat", data);
    });
  });
};
