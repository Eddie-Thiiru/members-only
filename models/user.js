const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 1, maxLength: 20 },
  second_name: { type: String, required: true, minLength: 1, maxLength: 20 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
});

module.exports = mongoose.model("User", UserSchema);
