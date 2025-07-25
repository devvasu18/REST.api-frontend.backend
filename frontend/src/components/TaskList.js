import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState("all");
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');



  // 🔁 Fetch tasks
 const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  try {
    const res = await axios.get('http://localhost:5000/api/tasks', {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    setTasks(res.data);
  } catch (err) {
    console.error("Fetch tasks error:", err.response?.data || err.message);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ Add task
const handleAdd = async () => {
  const token = localStorage.getItem("token");
  if (!title.trim()) {
    alert("Task title is required");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/tasks",
      {
        title: title.trim(),    // ✅ safe to send
        dueDate: dueDate || null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTitle("");
    setDueDate("");
    fetchTasks();
  } catch (err) {
    console.error("Add task error:", err.response?.data || err.message);
  }
};



  // ❌ Delete task
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    fetchTasks();
  };

  // ✅ Toggle completion with checkbox
  const toggleCompletion = async (task) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${task._id}`,
        { completed: !task.completed },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      const updatedTask = res.data;
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    } catch (err) {
      console.error("Error updating task", err);
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
      <h2 className="text-center mb-4">📝 Task Manager</h2>

      {/* Add Task */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>Add Task</button>
      </div>

      {/* Filter Buttons */}
      <div className="btn-group mb-3">
        <button className="btn btn-outline-primary" onClick={() => setFilter("all")}>All</button>
        <button className="btn btn-outline-success" onClick={() => setFilter("completed")}>Completed</button>
        <button className="btn btn-outline-danger" onClick={() => setFilter("incomplete")}>Incomplete</button>
      </div>

      {/* 🔍 Search + Sort UI */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sort by Due Date</option>
          <option value="asc">Oldest First</option>
          <option value="desc">Newest First</option>
        </select>
      </div>

      {/* 📋 Filtered Task List */}
      {filteredTasks.map(task => (
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
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
              </div>
              {task.dueDate && (
                <small className="text-muted ms-4 mt-1">
                  📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </small>
              )}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
