import Message from "../models/MessageModel.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const newMessage = new Message({
    chatId,
    senderId,
    text,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
