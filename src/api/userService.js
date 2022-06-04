import { USER_ROLE } from "../constants/user";

// const baseURI=process.env.REACT_APP_BASE_API
const baseURI = "http://localhost:3001";

async function getUsers() {
  const response = await fetch(`${baseURI}/users`);
  return await response.json();
}

async function getUserById(id) {
  const response = await fetch(`${baseURI}/users/${id}`);
  return await response.json();
}

async function deleteUserById(id) {
  const response = await fetch(`${baseURI}/users/${id}`, { method: "DELETE" });
  return await response.json();
}

async function saveUser(user) {
  if (!user.picture)
    user.picture = `https://picsum.photos/200?random=${Math.random().toFixed(2) * 100}`

  const response = user.id ? await fetch(`${baseURI}/users/${user.id}`, {
    method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user)
  }) :
    await fetch(`${baseURI}/users`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });

  return await response.json();
}

async function registerUser(user) {
  const response = await fetch(`${baseURI}/users?email=${user.email}`);
  const existingUsers = await response.json();
  if (existingUsers.length > 0)
    throw new Error('Email already exists. Please try again');

  user.role = USER_ROLE.CUSTOMER;

  return saveUser(user);
}

async function loginUser(user) {
  const response = await fetch(`${baseURI}/users`);
  const allUsers = await response.json();
  const existingUser = allUsers.find(u => u.email === user.email && u.password === user.password);
  if (!existingUser)
    throw new Error('Invalid username or password');

  return existingUser;
}

export { getUserById, getUsers, deleteUserById, saveUser, registerUser, loginUser };
