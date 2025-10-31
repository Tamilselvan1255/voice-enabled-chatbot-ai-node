const mongoose = require("mongoose");

const chatInfo = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("chat", chatInfo);
module.exports = chatModel;
