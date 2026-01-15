import { useState, useCallback } from "react";
import type { User } from "../services/api";
import {
  fetchUsers,
  createUser as apiCreateUser,
  editUser as apiEditUser,
  deleteUser as apiDeleteUser,
} from "../services/api";

export const useUserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [userError, setUserError] = useState<string | null>(null);

  const getUsers = useCallback(async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      setUserError("Could not fetch users.");
      console.error(err);
    }
  }, []);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserName.trim()) return;
    try {
      await apiCreateUser(newUserEmail, newUserName);
      setNewUserEmail("");
      setNewUserName("");
      await getUsers();
    } catch (err) {
      setUserError("Could not create user.");
      console.error(err);
    }
  };

  const startEditUser = (id: number, email: string, name: string) => {
    setEditUserId(id);
    setEditUserEmail(email);
    setEditUserName(name);
  };

  const cancelEditUser = () => {
    setEditUserId(null);
    setEditUserEmail("");
    setEditUserName("");
  };

  const handleEditUser = async (id: number) => {
    if (!editUserEmail.trim() || !editUserName.trim()) return;
    try {
      await apiEditUser(id, editUserEmail, editUserName);
      setEditUserId(null);
      setEditUserEmail("");
      setEditUserName("");
      await getUsers();
    } catch (err) {
      setUserError("Could not edit user.");
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await apiDeleteUser(id);
      await getUsers();
    } catch (err) {
      setUserError("Could not delete user.");
      console.error(err);
    }
  };

  return {
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
  };
};


