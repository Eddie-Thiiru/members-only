const mongoose = require("mongoose");
const format = require("date-fns/format");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 300 },
  text: { type: String, required: true, minLength: 1, maxLength: 40000 },
  timestamp: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

MessageSchema.virtual("edited_date").get(function () {
  return format(new Date(this.timestamp), "do MMMM yyyy");
});

MessageSchema.virtual("url").get(function () {
  const title = this.title.toLowerCase().replace(/ /g, "_");

  return `post/${title}/${this._id}`;
});

module.exports = mongoose.model("Message", MessageSchema);
