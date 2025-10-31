const axios = require("axios");
const chatModel = require("../models/chatModel");
const { default: mongoose } = require("mongoose");
const moment = require("moment-timezone");

const huggiceFaceUrl = process.env.HUGGING_FACE_URI;

const question = async (req, res) => {
  const { question } = req.body;
  try {
    const user = req.user.userId;

    if (!question) {
      return res.status(400).send({ error: "Question is required" });
    }

    const response = await axios.post(
      huggiceFaceUrl,
      {
        inputs: question,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer =
      response.data && response.data[0]
        ? response.data[0].summary_text || JSON.stringify(response.data[0])
        : "No response";

    await chatModel.create({
      userId: user,
      query: question,
      response: answer,
    });

    return res.status(200).send({ data: answer });
  } catch (error) {
    console.error("Error while fetching question", error.message);
    return res.status(500).send({ error: "Internal server error" });
  }
};

const viewHistory = async (req, res) => {
  try {
    const user = req.user.userId;
    const userId = new mongoose.Types.ObjectId(user);
    const response = await chatModel
      .find({ userId, isDeleted: false })
      .sort({ createdAt: -1 });

    if (response.length === 0) {
      return res.status(404).send({ message: "No history found!" });
    }

    const formatData = response.map((item) => ({
      ...item._doc,
      createdAt: moment(item.createdAt)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));
    return res
      .status(200)
      .send({ message: "History fetched successfully!", data: formatData });
  } catch (error) {
    console.error("Error while view history", error.message);
    return res.status(500).send({ error: "Internal server error" });
  }
};

const deleteHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const user = req.user.userId;
    const chatId = new mongoose.Types.ObjectId(id);
    const existHistory = await chatModel.findOne({
      userId: user,
      _id: chatId,
      isDeleted: false,
    });
    if (!existHistory) {
      return res.status(404).send({ error: "Chat history not exists!" });
    }

    await existHistory.updateOne({ isDeleted: true });
    return res.status(200).send({ message: "History removed successfully!" });
  } catch (error) {
    console.error("Error while deleting history", error.message);
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = { question, viewHistory, deleteHistory };
