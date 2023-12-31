const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const roomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  max: {
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },

  owner: {
    type: ObjectId,
    required: true,
    ref: "User",
  },

  password: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
