import React, { useState } from "react";
import "./Form.css";

function StudentForm({ onStudentAdded }) {
  const [formData, setFormData] = useState({ Name: "", email: "", age: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data using Axios
    onStudentAdded(formData); // pass data to App
    setMessage("Form submitted successfully!");
    setFormData({ Name: "", email: "", age: "" });
  };

  return (
    <div className="student-form">
      <h2>Student Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={formData.Name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default StudentForm;
