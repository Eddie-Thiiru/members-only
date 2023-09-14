const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PasscodeSchema = new Schema({
  club_key: { type: String },
  admin_key: { type: String },
});

module.exports = mongoose.model("Passcode", PasscodeSchema);
