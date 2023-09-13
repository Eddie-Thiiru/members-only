const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/user");

exports.user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("user_detail", { user: user });
});

exports.user_login_get = (req, res, next) => {
  res.render("login_form", { title: "Log In" });
};

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/clubhouse",
  failureRedirect: "/log-in",
});

exports.user_signup_get = (req, res, next) => {
  res.render("signup_form", { title: "Sign Up" });
};

exports.user_signup_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1, max: 10 })
    .escape()
    .withMessage(
      "First name must be specified and should not be more than 10 characters"
    )
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters"),
  body("second_name")
    .trim()
    .isLength({ min: 1, max: 10 })
    .escape()
    .withMessage(
      "Second name must be specified and should not be more than 10 characters"
    )
    .isAlphanumeric()
    .withMessage("Second name has non-alphanumeric characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Not a valid email address")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

      if (user) {
        throw new Error("Email already in use");
      }
    }),
  body("password", "Password must have a minimum of 8 characters")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body("password_confirmation")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirmation password does not match");
      }
    }),

  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      const errors = validationResult(req);

      const user = new User({
        first_name: req.body.first_name,
        second_name: req.body.second_name,
        email: req.body.email,
        password: hashedPassword,
      });

      if (!errors.isEmpty()) {
        res.render("signup_form", {
          title: "Sign Up",
          user: user,
          errors: errors.array(),
        });

        return;
      } else {
        await user.save();

        res.redirect("/log-in");
      }
    });
  }),
];
