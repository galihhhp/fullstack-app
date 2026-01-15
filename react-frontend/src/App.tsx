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
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        {(message || error || userError) && (
          <div className="messages">
            {message && <div className="message message-info">{message}</div>}
            {error && <div className="message message-error">{error}</div>}
            {userError && <div className="message message-error">{userError}</div>}
          </div>
        )}
      </header>

      <main className="app-main">
        <section className="section">
          <div className="card">
            <form onSubmit={handleCreateTask} className="form">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                aria-label="New task input"
                className="input"
              />
              <button type="submit" className="btn btn-primary">Add Task</button>
            </form>
          </div>

          <div className="section-header">
            <h2>Tasks</h2>
            <span className="count">{tasks.length}</span>
          </div>
          
          <ul className="list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className="list-item">
                  {editTaskId === task.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editTaskValue}
                        onChange={(e) => setEditTaskValue(e.target.value)}
                        aria-label="Edit task input"
                        autoFocus
                        className="input"
                      />
                      <div className="btn-group">
                        <button onClick={() => handleEditTask(task.id)} type="button" className="btn btn-primary btn-sm">
                          Save
                        </button>
                        <button onClick={cancelEditTask} type="button" className="btn btn-secondary btn-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="list-item-content">
                      <span className="list-item-text">{task.task}</span>
                      <div className="list-item-actions">
                        {featureEditTask && (
                          <button
                            onClick={() => startEditTask(task.id, task.task)}
                            type="button"
                            className="btn btn-ghost btn-sm">
                            Edit
                          </button>
                        )}
                        {featureDeleteTask && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            type="button"
                            className="btn btn-ghost btn-sm btn-danger">
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="list-item list-item-empty">No tasks yet.</li>
            )}
          </ul>
        </section>

        <section className="section">
          <div className="card">
            <form onSubmit={handleCreateUser} className="form form-multi">
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="User email"
                aria-label="New user email input"
                className="input"
              />
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="User name"
                aria-label="New user name input"
                className="input"
              />
              <button type="submit" className="btn btn-primary">Add User</button>
            </form>
          </div>

          <div className="section-header">
            <h2>Users</h2>
            <span className="count">{users.length}</span>
          </div>

          <ul className="list">
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user.id} className="list-item">
                  {editUserId === user.id ? (
                    <div className="edit-form">
                      <input
                        type="email"
                        value={editUserEmail}
                        onChange={(e) => setEditUserEmail(e.target.value)}
                        aria-label="Edit user email input"
                        autoFocus
                        className="input"
                      />
                      <input
                        type="text"
                        value={editUserName}
                        onChange={(e) => setEditUserName(e.target.value)}
                        aria-label="Edit user name input"
                        className="input"
                      />
                      <div className="btn-group">
                        <button onClick={() => handleEditUser(user.id)} type="button" className="btn btn-primary btn-sm">
                          Save
                        </button>
                        <button onClick={cancelEditUser} type="button" className="btn btn-secondary btn-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="list-item-content">
                      <div className="list-item-text">
                        <span className="user-email">{user.email}</span>
                        <span className="user-name">{user.name}</span>
                      </div>
                      <div className="list-item-actions">
                        <button
                          onClick={() => startEditUser(user.id, user.email, user.name)}
                          type="button"
                          className="btn btn-ghost btn-sm">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          type="button"
                          className="btn btn-ghost btn-sm btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="list-item list-item-empty">No users yet.</li>
            )}
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <span>Version {VERSION}</span>
      </footer>
    </div>
  );
}

export default App;
