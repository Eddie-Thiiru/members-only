const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PasscodeSchema = new Schema({
  key: { type: String },
});

module.exports = mongoose.model("Passcode", PasscodeSchema);
