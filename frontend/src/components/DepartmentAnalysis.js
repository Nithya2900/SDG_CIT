import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DepartmentAnalysis.css";

const DepartmentAnalysis = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [newStudent, setNewStudent] = useState({
    name: "",
    registerNumber: "",
    email: "",
    department: "",
    marks: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((res) => {
        const sortedData = [...res.data].sort((a, b) => b.marks - a.marks);
        console.log("Sorted Students:", sortedData); // Debugging
        setStudents(sortedData);
        setFilteredStudents(sortedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    let filtered = department === "All" 
      ? [...students] 
      : students.filter((s) => s.department === department);
      
    filtered = searchTerm 
      ? filtered.filter((s) => s.registerNumber.includes(searchTerm)) 
      : filtered;
  
    // Ensure sorted order is maintained
    filtered.sort((a, b) => b.marks - a.marks);
  
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };
  

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    let filtered = selectedDepartment === "All" ? students : students.filter((s) => s.department === selectedDepartment);
    filtered = term ? filtered.filter((s) => s.registerNumber.includes(term)) : filtered;
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  // ✅ Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // ✅ Pagination Handlers
  const nextPage = () => {
    if (indexOfLastStudent < filteredStudents.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ✅ Open Edit Form
  const handleEdit = (student) => {
    setEditStudent(student);
    setShowEditForm(true);
  };

  // ✅ Update Student Details
  const handleUpdateStudent = () => {
    axios
      .put(`http://localhost:5000/students/${editStudent.registerNumber}`, editStudent)
      .then(() => {
        fetchStudents();
        setShowEditForm(false);
        setEditStudent(null);
      })
      .catch((error) => console.error("Error updating student:", error));
  };

  // ✅ Delete Student
  const handleDelete = (registerNumber) => {
    axios
      .delete(`http://localhost:5000/students/${registerNumber}`)
      .then(() => {
        // ✅ Remove deleted student from local state immediately
        setFilteredStudents((prevStudents) =>
          prevStudents.filter((student) => student.registerNumber !== registerNumber)
        );
  
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.registerNumber !== registerNumber)
        );
      })
      .catch((error) => console.error("Error deleting student:", error));
  };
  

  // ✅ Open Add Form
  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  // ✅ Add Student
  const handleAddStudent = () => {
    axios
      .post("http://localhost:5000/students", newStudent)
      .then(() => {
        fetchStudents();
        setNewStudent({ name: "", registerNumber: "", email: "", department: "", marks: 0 });
        setShowAddForm(false);
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  const departments = ["All", "CS", "DA", "EC", "EE", "BM", "ME", "CE"];

  return (
    <div className="container">
      <div className="header">
        <h1>Student Ranking Analysis</h1>
        <button className="add-student-btn" onClick={handleShowAddForm} style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "#6A0DAD",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
          }}>Add Student</button>
      </div>

      <input type="text" placeholder="Search by Register Number" value={searchTerm} onChange={handleSearchChange} className="search-box" />

      <div className="department-buttons">
        {departments.map((dept) => (
          <button key={dept} onClick={() => handleDepartmentClick(dept)} className={selectedDepartment === dept ? "active" : ""}>
            {dept}
          </button>
        ))}
      </div>

      {/* ✅ Add Student Form */}
      {showAddForm && (
        <div className="form-container">
          <h3>Add Student</h3>
          <input type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
          <input type="text" placeholder="Register Number" value={newStudent.registerNumber} onChange={(e) => setNewStudent({ ...newStudent, registerNumber: e.target.value })} />
          <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
          <input type="text" placeholder="Department" value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })} />
          <input type="number" placeholder="Marks" value={newStudent.marks} onChange={(e) => setNewStudent({ ...newStudent, marks: Number(e.target.value) })} />

          <button onClick={handleAddStudent}>Submit</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}
      {/* ✅ Edit Student Form */}
      {showEditForm && (
        <div className="form-container">
          <h3>Edit Student</h3>
          <input type="text" placeholder="Name" value={editStudent.name}
            onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} />
          <input type="text" placeholder="Register Number" value={editStudent.registerNumber} />
          <input type="email" placeholder="Email" value={editStudent.email}
            onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} />
          <input type="text" placeholder="Department" value={editStudent.department}
            onChange={(e) => setEditStudent({ ...editStudent, department: e.target.value })} />
          <input type="number" placeholder="Marks" value={editStudent.marks}
            onChange={(e) => setEditStudent({ ...editStudent, marks: Number(e.target.value) })} />
          
          <button onClick={handleUpdateStudent}>Update</button>
          <button onClick={() => setShowEditForm(false)}>Cancel</button>

        </div>
      )}


      {/* ✅ Student List */}
      <table className="student-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Register Number</th>
            <th>Email</th>
            <th>Department</th>
            <th>Marks</th>
            <th>Pass/Fail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {currentStudents.map((student, index) => (
    <tr key={`${student.registerNumber}-${index}`}> {/* Ensure unique keys */}
      <td>{indexOfFirstStudent + index + 1}</td>
      <td>{student.name}</td>
      <td>{student.registerNumber}</td>
      <td>{student.email}</td>
      <td>{student.department}</td>
      <td>{student.marks}</td>
      <td style={{ color: student.marks >= 40 ? "green" : "red" }}>
        {student.marks >= 40 ? "Pass" : "Fail"}
      </td>
      <td>
        <button onClick={() => handleEdit(student)}>Edit</button>
        <button onClick={() => handleDelete(student.registerNumber)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* ✅ Pagination Buttons */}
      <button onClick={prevPage} disabled={currentPage === 1} className="arrow-button">
    ◀
  </button>
  <span> Page {currentPage} of {Math.ceil(filteredStudents.length / studentsPerPage)} </span>
  <button onClick={nextPage} disabled={indexOfLastStudent >= filteredStudents.length} className="arrow-button">
    ▶
  </button>
      </div>
  );
};

export default DepartmentAnalysis;
