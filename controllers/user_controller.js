const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/user");
const Passcode = require("../models/passcode");

exports.user_login_get = (req, res, next) => {
  const message = req.session.messages;

  res.render("login_form", { message });
};

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true,
});

exports.user_logout_get = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
};

exports.user_signup_get = (req, res, next) => {
  res.render("signup_form");
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
      } else {
        return true;
      }
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    let user = new User({
      first_name: req.body.first_name,
      second_name: req.body.second_name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render("signup_form", {
        title: "Sign Up",
        user: user,
        errors: errors.array(),
      });

      return;
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {
          user.password = hashedPassword;

          await user.save();

          passport.authenticate("local")(req, res, function () {
            res.redirect("/");
          });
        } catch (error) {
          return next(error);
        }
      });
    }
  }),
];

exports.user_join_get = (req, res, next) => {
  if (req.user && req.user.member === false) {
    res.render("join_club_form");
  } else if (req.user && req.user.member === true) {
    res.render("/");
  } else {
    res.redirect("/signup");
  }
};

exports.user_join_post = [
  body("passcode")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Should not be empty")
    .custom(async (value) => {
      const passcode = await Passcode.findOne({ club_key: { $exists: true } });

      if (value !== passcode.club_key) {
        throw new Error("Wrong Passcode");
      }
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = req.user;

    if (!errors.isEmpty()) {
      res.render("join_club_form", { errors: errors.array() });
      return;
    } else {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { member: true } }
      );

      res.redirect("/");
    }
  }),
];

exports.user_admin_get = (req, res, next) => {
  if (req.user && req.user.member === true) {
    res.render("admin_form");
  } else if (req.user && req.user.member === false) {
    res.render("join_club_form");
  } else {
    res.redirect("/login");
  }
};

exports.user_admin_post = [
  body("passcode")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Should not be empty")
    .custom(async (value) => {
      const passcode = await Passcode.findOne({ admin_key: { $exists: true } });

      if (value !== passcode.admin_key) {
        throw new Error("Wrong Passcode");
      }
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = req.user;

    if (!errors.isEmpty()) {
      res.render("admin_form", { errors: errors.array() });
      return;
    } else {
      await User.findOneAndUpdate({ _id: user._id }, { $set: { admin: true } });

      res.redirect("/");
    }
  }),
];
