const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user_controller");
const message_controller = require("../controllers/message_controller");

/// MESSAGE ROUTES ///

// GET homepage
router.get("/", message_controller.index);

// // GET request to create new message
// router.get("/:id/post/new", message_controller.message_new_get);

// // POST request to create new message
// router.post("/:id/post/new", message_controller.message_new_post);

// // GET request for list of all messages when user is a member
// router.get("/clubhouse", message_controller.members_message_list);

/// USER ROUTES ///

// GET request for new user signup
router.get("/signup", user_controller.user_signup_get);

// POST request for new user signup
router.post("/signup", user_controller.user_signup_post);

// // GET request for user login
// router.get("/login", user_controller.user_login_get);

// // POST request for user login
// router.post("/login", user_controller.user_login_post);

// // GET request for join club
// router.get("/user/:username/join", user_controller.user_join_get);

// // POST request for join club
// router.post("/user/:username/join", user_controller.user_join_post);

// GET request for user details
router.get("/user/:username", user_controller.user_detail);

module.exports = router;
