const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/Student");
const router = express.Router();

// ✅ GET: Fetch all students (sorted by marks) from student_db
router.get("/", async (req, res) => {
  try {
    const students = await mongoose.connection.db.collection("student_db").find().sort({ marks: -1 }).toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST: Add a new student
router.post("/", async (req, res) => {
  try {
    const { name, registerNumber, email, department, marks } = req.body;
    if (!name || !registerNumber || !email || !department || marks === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingStudent = await mongoose.connection.db.collection("student_db").findOne({ registerNumber });
    if (existingStudent) {
      return res.status(400).json({ error: "Student with this register number already exists" });
    }
    const newStudent = { name, registerNumber, email, department, marks };
    await mongoose.connection.db.collection("student_db").insertOne(newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ PUT: Update student details
router.put("/:registerNumber", async (req, res) => {
  try {
    const { name, email, department, marks } = req.body;
    const updatedStudent = await mongoose.connection.db.collection("student_db").findOneAndUpdate(
      { registerNumber: req.params.registerNumber },
      { $set: { name, email, department, marks } },
      { returnDocument: "after" }
    );
    if (!updatedStudent.value) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStudent.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE: Remove a student
router.delete("/:registerNumber", async (req, res) => {
  try {
    console.log(`🔍 Attempting to delete student with registerNumber: ${req.params.registerNumber}`);
    const deletedStudent = await mongoose.connection.db.collection("student_db").findOneAndDelete({ registerNumber: req.params.registerNumber });
    if (!deletedStudent.value) {
      console.log("❌ Student not found!");
      return res.status(404).json({ error: "Student not found" });
    }
    console.log("✅ Student deleted successfully:", deletedStudent.value);
    res.json({ message: "Student deleted successfully", deletedStudent: deletedStudent.value });
  } catch (error) {
    console.error("🔥 Error deleting student:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
