// Base Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  displayInfo() {
    return `Name: ${this.name}, Age: ${this.age}`;
  }
}

// Subclass: Student
class Student extends Person {
  constructor(name, age, course) {
    super(name, age);
    this.course = course;
  }

  displayInfo() {
    return `${super.displayInfo()}, Course: ${this.course}`;
  }
}

// Subclass: Teacher
class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  displayInfo() {
    return `${super.displayInfo()}, Subject: ${this.subject}`;
  }
}

// DOM Elements
const app = document.getElementById("app");
const typeSelect = document.getElementById("type");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const extraInput = document.getElementById("extra");
const extraLabel = document.getElementById("extra-label");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");

// Update label based on type
typeSelect.addEventListener("change", () => {
  if (typeSelect.value === "student") {
    extraLabel.textContent = "Course:";
    extraInput.placeholder = "Enter course";
  } else {
    extraLabel.textContent = "Subject:";
    extraInput.placeholder = "Enter subject";
  }
});

// Helper to create a card
function createCard(title, info) {
  return `
    <div class="card">
      <div class="title">${title}</div>
      <div class="info">${info}</div>
    </div>
  `;
}

// Add person on button click
addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const age = parseInt(ageInput.value);
  const extra = extraInput.value.trim();

  if (!name || !age || !extra) {
    alert("Please fill in all fields.");
    return;
  }

  let person;
  if (typeSelect.value === "student") {
    person = new Student(name, age, extra);
  } else {
    person = new Teacher(name, age, extra);
  }

  app.innerHTML += createCard(
    typeSelect.value === "student" ? "Student" : "Teacher",
    person.displayInfo()
  );

  // Reset form
  nameInput.value = "";
  ageInput.value = "";
  extraInput.value = "";
});

// Clear all cards
clearBtn.addEventListener("click", () => {
  app.innerHTML = "";
});
