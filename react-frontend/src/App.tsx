import { useState, useEffect } from "react";
import "./App.css";
import { useTaskManager } from "./hooks/useTaskManager";
import { useUserManager } from "./hooks/useUserManager";
import { loadConfig } from "./config";

const VERSION = import.meta.env.VITE_APP_VERSION;

function App() {
  const {
    message,
    tasks,
    newTask,
    setNewTask,
    error,
    handleCreateTask,
    getTasks,
    editTaskId,
    editTaskValue,
    setEditTaskValue,
    startEditTask,
    cancelEditTask,
    handleEditTask,
    handleDeleteTask,
  } = useTaskManager();
  const {
    users,
    newUserEmail,
    setNewUserEmail,
    newUserName,
    setNewUserName,
    editUserId,
    editUserEmail,
    setEditUserEmail,
    editUserName,
    setEditUserName,
    userError,
    getUsers,
    handleCreateUser,
    startEditUser,
    cancelEditUser,
    handleEditUser,
    handleDeleteUser,
  } = useUserManager();
  const [featureEditTask, setFeatureEditTask] = useState(false);
  const [featureDeleteTask, setFeatureDeleteTask] = useState(false);

  useEffect(() => {
    loadConfig().then((cfg) => {
      if (cfg) {
        setFeatureEditTask(cfg.featureEditTask);
        setFeatureDeleteTask(cfg.featureDeleteTask);
      }
    });
    getTasks();
    getUsers();
  }, [getTasks, getUsers]);

  return (
    <>
      <h1>Task Manager</h1>
      <p>{message ?? ""}</p>
      <p>{error ?? ""}</p>
      <p>{userError ?? ""}</p>

      <div className="card">
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            aria-label="New task input"
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      <h2>Tasks</h2>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTaskValue}
                    onChange={(e) => setEditTaskValue(e.target.value)}
                    aria-label="Edit task input"
                    autoFocus
                  />
                  <button onClick={() => handleEditTask(task.id)} type="button">
                    Save
                  </button>
                  <button onClick={cancelEditTask} type="button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {task.task}
                  {featureEditTask && (
                    <button
                      onClick={() => startEditTask(task.id, task.task)}
                      type="button"
                      style={{ marginLeft: 8 }}>
                      Edit
                    </button>
                  )}
                  {featureDeleteTask && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      type="button"
                      style={{ marginLeft: 8 }}>
                      Delete
                    </button>
                  )}
                </>
              )}
            </li>
          ))
        ) : (
          <li>No tasks yet.</li>
        )}
      </ul>
      <h2>Users</h2>
      <div className="card">
        <form onSubmit={handleCreateUser}>
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="User email"
            aria-label="New user email input"
          />
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="User name"
            aria-label="New user name input"
          />
          <button type="submit">Add User</button>
        </form>
      </div>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {editUserId === user.id ? (
                <>
                  <input
                    type="email"
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    aria-label="Edit user email input"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    aria-label="Edit user name input"
                  />
                  <button onClick={() => handleEditUser(user.id)} type="button">
                    Save
                  </button>
                  <button onClick={cancelEditUser} type="button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {user.email} - {user.name}
                  <button
                    onClick={() => startEditUser(user.id, user.email, user.name)}
                    type="button"
                    style={{ marginLeft: 8 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    type="button"
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No users yet.</li>
        )}
      </ul>
      <footer style={{ marginTop: 32, opacity: 0.6, fontSize: 14 }}>
        Frontend version: {VERSION}
      </footer>
    </>
  );
}

export default App;
