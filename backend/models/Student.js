const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registerNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  marks: { type: Number, required: true }
});

// 👇 Force MongoDB to use the correct collection name
module.exports = mongoose.model("Student", studentSchema, "student_db");
