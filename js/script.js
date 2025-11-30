// =============================
// 🎨 Efek Ngetik Judul
// =============================
const titleElement = document.getElementById("typing-title");
const titleText = "To-do List";
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!isDeleting) {
    titleElement.textContent = titleText.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === titleText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1000); // jeda sebelum hapus
      return;
    }
  } else {
    titleElement.textContent = titleText.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
    }
  }
  setTimeout(typeEffect, isDeleting ? 100 : 200);
}
typeEffect();

// =============================
// 📝 Logika Todo List
// =============================

// Elemen DOM
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const filterBtn = document.getElementById("filterBtn");
const filterOptions = document.getElementById("filterOptions");
const searchInput = document.getElementById("searchInput");

// Stat elements
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const overdueCountEl = document.getElementById("overdueCount");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Data
let tasks = [];
let editIndex = null; // untuk simpan index task yang sedang diedit

// 🎉 Efek confetti
function launchConfetti() {
  confetti({
    particleCount: 600,
    spread: 300,
    origin: { y: 0.6 },
  });
}

// =============================
// 🔄 Render Tasks
// =============================
function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" class="no-task">No task found</td>`;
    taskList.appendChild(row);
    updateStats();
    return;
  }

  filteredTasks.forEach((task, index) => {
    const row = document.createElement("tr");

    // tambahin class "completed" untuk task yg sudah selesai (buat progress bar)
    if (task.completed) row.classList.add("completed");

    const today = new Date().setHours(0, 0, 0, 0);
    const dueDate = new Date(task.date).setHours(0, 0, 0, 0);

    let statusText = task.completed ? "✅ Done" : "⏳ Pending";
    if (!task.completed && dueDate < today) statusText = "⚠️ Overdue";

    row.innerHTML = `
      <td>${task.text}</td>
      <td>${task.date || "-"}</td>
      <td>${statusText}</td>
      <td>
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="editTask(${index})">✏</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </td>
    `;

    taskList.appendChild(row);
  });

  updateStats();
}

// =============================
// 📊 Update Stats & Progress
// =============================
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  const today = new Date().setHours(0, 0, 0, 0);

  const overdue = tasks.filter(
    (t) => !t.completed && t.date && new Date(t.date).setHours(0,0,0,0) < today
  ).length;

  const pending = tasks.filter(
    (t) => !t.completed && (!t.date || new Date(t.date).setHours(0,0,0,0) >= today)
  ).length;

  // Update angka di stat card
  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
  overdueCountEl.textContent = overdue;

  // Update progress bar
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  progressBar.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

// =============================
// ➕ Tambah / Update Task
// =============================
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const date = dateInput.value;

  // ❌ Jika salah satu kosong, hentikan
  if (text === "" || date === "") {
    alert("Please fill both Task and Date before adding!");
    return;
  }

  if (editIndex !== null) {
    // ✏ Update mode
    tasks[editIndex].text = text;
    tasks[editIndex].date = date;
    editIndex = null;
    addBtn.textContent = "Add Task"; // reset tombol
  } else {
    // ➕ Add mode
    tasks.push({ text, date, completed: false });
  }

  // reset input
  taskInput.value = "";
  dateInput.value = "";
  renderTasks();
});

// =============================
// ✔ Toggle Complete
// =============================
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;

  if (tasks[index].completed) {
    launchConfetti();
  }

  renderTasks();
}

// =============================
// ✏ Edit Task
// =============================
function editTask(index) {
  taskInput.value = tasks[index].text;
  dateInput.value = tasks[index].date;
  editIndex = index;
  addBtn.textContent = "Update Task"; // ubah tombol
}

// =============================
// 🗑 Delete Task
// =============================
function deleteTask(index) {
  const confirmation = confirm("Are you sure you want to delete this task?");
  
  if (confirmation) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

// 🗑 Delete All
deleteAllBtn.addEventListener("click", () => {
  const confirmation = confirm("Are you sure you want to delete ALL tasks?");
  
  if (confirmation) {
    tasks = [];
    renderTasks();
  }
});

// =============================
// 🔎 Filter & Search
// =============================

// Toggle filter menu
filterBtn.addEventListener("click", () => {
  filterOptions.style.display =
    filterOptions.style.display === "none" ? "block" : "none";
});

// Apply filter
document.querySelectorAll(".filterOption").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    if (filter === "all") renderTasks();
    if (filter === "complete") renderTasks(tasks.filter((t) => t.completed));
    if (filter === "uncomplete") renderTasks(tasks.filter((t) => !t.completed));
  });
});

// Search
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  renderTasks(tasks.filter((t) => t.text.toLowerCase().includes(query)));
});

// =============================
// 🚀 Init
// =============================
renderTasks();
