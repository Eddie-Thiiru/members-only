const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 1, maxLength: 10 },
  second_name: { type: String, required: true, minLength: 1, maxLength: 10 },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 8 },
  member: { type: Boolean, default: false },
});

UserSchema.virtual("username").get(function () {
  let email = this.email;
  let username = email.split("@")[0];

  return username;
});

UserSchema.virtual("url").get(function () {
  let email = this.email;
  let username = email.split("@")[0];

  return `/user/${username}`;
});

module.exports = mongoose.model("User", UserSchema);
