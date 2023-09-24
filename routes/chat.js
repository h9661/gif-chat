const express = require("express");
const multer = require("multer");
const path = require("path");
const Chat = require("../schemas/chat");
const router = express.Router();

// multer 설정
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/gif/");
    },
    filename(req, file, cb) {
      // 파일명: 날짜-파일명.확장자
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", upload.single("gif"), async (req, res, next) => {
  try {
    const chat = new Chat({
      room: req.body.room,
      user: req.body.user,
      chat: req.body.chat,
      gif: req.file ? `/gif/${req.file.filename}` : "",
    });

    console.log(chat);

    await chat.save();
    res.send(chat);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
