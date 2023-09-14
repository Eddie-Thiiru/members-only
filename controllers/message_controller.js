const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");

exports.index = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find().sort({ timestamp: 1 }).exec();
  const user = req.user;

  res.render("index.pug", {
    title: "All Messages",
    user: user,
    all_messages: allMessages,
  });
});
