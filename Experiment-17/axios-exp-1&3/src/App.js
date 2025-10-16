import React, { useState } from "react";
import StudentForm from "./components/StudentForm";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

function App() {
  const [newStudent, setNewStudent] = useState(null);

  return (
    <div>
      <StudentForm onStudentAdded={setNewStudent} />
      <hr />
      <AdminDashboard newStudent={newStudent} />
    </div>
  );
}

export default App;
