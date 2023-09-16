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

// GET request to delete post
router.get("/post/:title/:id/delete", message_controller.message_delete_get);

// POST request to delete post
router.post("/post/:title/:id/delete", message_controller.message_delete_post);

/// USER ROUTES ///

// GET request for new user signup
router.get("/signup", user_controller.user_signup_get);

// POST request for new user signup
router.post("/signup", user_controller.user_signup_post);

// GET request for user login
router.get("/login", user_controller.user_login_get);

// POST request for user login
router.post("/login", user_controller.user_login_post);

// GET request for user logout
router.get("/logout", user_controller.user_logout_get);

// GET request for join club
router.get("/clubhouse/join", user_controller.user_join_get);

// POST request for join club
router.post("/clubhouse/join", user_controller.user_join_post);

// GET request for add admin
router.get("/clubhouse/admin", user_controller.user_admin_get);

// POST request for add admin
router.post("/clubhouse/admin", user_controller.user_admin_post);

module.exports = router;
