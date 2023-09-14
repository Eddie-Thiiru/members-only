const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user_controller");
const message_controller = require("../controllers/message_controller");

/// MESSAGE ROUTES ///

// GET homepage
router.get("/", message_controller.index);

// GET request to create new message
router.get("/post", message_controller.message_new_get);

// POST request to create new message
router.post("/post", message_controller.message_new_post);

/// USER ROUTES ///

// GET request for new user signup
router.get("/sign-up", user_controller.user_signup_get);

// POST request for new user signup
router.post("/sign-up", user_controller.user_signup_post);

// GET request for user login
router.get("/log-in", user_controller.user_login_get);

// POST request for user login
router.post("/log-in", user_controller.user_login_post);

// GET request for join club
router.get("/clubhouse/join", user_controller.user_join_get);

// POST request for join club
router.post("/clubhouse/join", user_controller.user_join_post);

// GET request for user details
router.get("/user/:username", user_controller.user_detail);

module.exports = router;
