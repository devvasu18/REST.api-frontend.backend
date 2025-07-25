import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL; // Ensure this is set in your .env file
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState("all");
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
const [ setFilteredTasks] = useState([]);



  // 🔁 Fetch tasks
 const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/tasks`, {
        headers: { Authorization: "Bearer " + token },
      });
      setTasks(res.data); // updates tasks
    } catch (err) {
      console.error("Fetch tasks error:", err.response?.data || err.message);
    }
  };


  useEffect(() => {
    setTasks(tasks); // Sync when tasks update
  }, [tasks]);
  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ Add task
// ✅ 4. Add task and fetch again
  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/tasks`,
        { title: title.trim(), dueDate: dueDate || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");        // clear input
      setDueDate("");      // clear date
      fetchTasks();        // refresh list
    } catch (err) {
      console.error("Add task error:", err.response?.data || err.message);
    }
  };



// ✅ 5. Delete task
  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // refresh list
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

 
  // ✅ 6. Toggle completion
  const toggleCompletion = async (task) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${BASE_URL}/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // refresh list
    } catch (err) {
      console.error("Toggle error:", err.response?.data || err.message);
    }
  };

  // 🔍 Filter + Search + Sort
  let filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  filteredTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOrder === "asc") {
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortOrder === "desc") {
    filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }

 return (
    <div className="container mt-4">
      <h2>📝 Task Manager</h2>

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="form-control me-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Task
        </button>
      </div>

      {/* ✅ Render Task Cards */}
      {filteredTasks.map((task) => (
        <div key={task._id} className="card p-3 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task)}
                />
                <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                  {task.title}
                </span>
              </div>
              {task.dueDate && (
                <small className="text-muted ms-4 mt-1">
                  📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </small>
              )}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
