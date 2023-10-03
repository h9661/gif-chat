const express = require("express");
const router = express.Router();
const Room = require("../schemas/room");
const Chat = require("../schemas/chat");
const { isNotLoggedIn, isLoggedIn } = require("../middlewares");

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    // 방들을 가져올 때, owner의 username을 join해서 가져온다.
    const rooms = await Room.find({}).populate("owner");

    res.render("main", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room", (req, res) => {
  res.render("room", { title: "GIF 채팅방 생성" });
});

router.post("/room", async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.user._id,
      password: req.body.password,
    });
    const data = {
      title: newRoom.title,
      max: newRoom.max,
      owner: req.user,
      password: newRoom.password,
      _id: newRoom._id,
    };
    const io = req.app.get("io");
    io.of("/room").emit("newRoom", data);
    if (req.body.password) {
      // 비밀번호가 있는 방이면
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } else {
      res.redirect(`/room/${newRoom._id}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room/:id", async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    if (!room) {
      return res.redirect("/?error=존재하지 않는 방입니다.");
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect("/?error=비밀번호가 틀렸습니다.");
    }
    const io = req.app.get("io");
    const connectedUsers = req.app.get("connectedUsers");
    const { rooms } = io.of("/chat").adapter;

    if (room.max <= rooms.get(req.params.id)?.size) {
      return res.redirect("/?error=허용 인원이 초과하였습니다.");
    }
    if (connectedUsers[req.user._id]) {
      return res.redirect("/?error=이미 채팅방에 참여하고 있습니다.");
    }

    return res.render("chat", {
      room,
      title: room.title,
      user: req.user._id,
      username: req.user.username,
      color: req.user.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete("/room/:id", async (req, res, next) => {
  try {
    await Room.deleteOne({ _id: req.params.id });
    await Chat.deleteMany({ room: req.params.id });
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
