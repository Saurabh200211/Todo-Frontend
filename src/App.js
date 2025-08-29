import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [API_URL]);

  const addTask = async () => {
    if (taskInput.trim() === "") return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: taskInput }),
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTaskInput("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: "PUT" });
      const updatedTask = await res.json();
      setTasks(
        tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
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
