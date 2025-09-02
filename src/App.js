import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  // Base URL (replace with Render URL when deployed)
  const API_BASE = "https://todo-backend-lake-rho.vercel.app";

  // Fetch all tasks
  useEffect(() => {
    axios
      .get(`${API_BASE}/tasks`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else if (res.data.tasks) {
          setTasks(res.data.tasks);
        } else {
          console.error("Unexpected API response:", res.data);
        }
      })
      .catch((err) =>
        console.error("Error fetching tasks:", err.response?.data || err.message)
      );
  }, []);

  // Add new task
  const addTask = async () => {
    if (taskInput.trim() === "") return;
    try {
      const newTask = {
        text: taskInput, // ✅ backend expects "text"
        completed: false,
      };

      const res = await axios.post(`${API_BASE}/tasks`, newTask);

      const addedTask = res.data.task || res.data;
      setTasks([...tasks, addedTask]);
      setTaskInput("");
    } catch (err) {
      console.error("Error adding task:", err.response?.data || err.message);
      alert("Failed to add task. Check backend API requirements.");
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/tasks/${id}`);
      const updatedTask = res.data.task || res.data;
      setTasks(
        tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    } catch (err) {
      console.error("Error toggling task:", err.response?.data || err.message);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err.message);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleTaskCompletion(task._id)}>
              {task.text} {/* ✅ backend uses "text" */}
            </span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
