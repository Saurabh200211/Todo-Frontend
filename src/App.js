import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  // Base URL (local for now, later replace with your Render URL when deployed)
  const API_BASE = "https://todo-backend-lake-rho.vercel.app/";

  // Fetch all tasks
  useEffect(() => {
    axios
      .get(`${API_BASE}/tasks`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add new task
  const addTask = async () => {
    if (taskInput.trim() === "") return;
    try {
      const res = await axios.post(`${API_BASE}/tasks`, {
        text: taskInput,
      });
      setTasks([...tasks, res.data]);
      setTaskInput("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/tasks/${id}`);
      setTasks(
        tasks.map((task) => (task._id === res.data._id ? res.data : task))
      );
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
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
              {task.text}
            </span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
