const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");

exports.index = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find()
    .populate("user")
    .sort({ timestamp: 1 })
    .exec();
  const user = req.user;

  res.render("index.pug", {
    user: user,
    all_messages: allMessages,
  });
});

exports.message_new_get = (req, res, next) => {
  res.render("new_message_form");
};

exports.message_new_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must no be empty")
    .isLength({ max: 300 })
    .escape()
    .withMessage("Title must not exceed 300 characters"),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Text must not be empty")
    .isLength({ max: 40000 })
    .escape()
    .withMessage("Text must not exceed 40,000 characters"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
      user: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render("new_message_form", {
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      await message.save();

      res.redirect("/");
    }
  }),
];

exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate("user").exec();

  res.render("delete_post", { message: message });
});

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (message === null) {
    res.redirect("/");
  }

  await Message.findByIdAndDelete(req.params.id);

  res.redirect("/");
});
