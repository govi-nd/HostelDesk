const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "warden"],
    default: "student",
  },
  hostel: {
    type: String,
    default: null,
  },
});

const Complaints = new Schema({
  userId: { type: ObjectId, ref: "users" },
  title: String,
  category: {
    type: String,
    enum: ["plumbing", "electrical", "cleanliness", "water", "maintenance", "other"],
    default: "other",
  },
  urgent: Boolean,
  hostel: String,
  room_no: String,
  done: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("users", User);
const ComplaintModel = mongoose.model("complaints", Complaints);

module.exports = {
  UserModel,
  ComplaintModel,
};
