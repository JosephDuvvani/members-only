import { pool } from "./pool.js";
import bcrypt from "bcryptjs";

const getUserByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username = $1;`,
    [username]
  );
  return rows.length > 0 ? rows[0] : null;
};

const addUser = async ({ firstname, lastname, username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    `
        INSERT INTO users (firstname, lastname, username, password) 
        VALUES ($1, $2, $3, $4)
    `,
    [firstname, lastname, username, hashedPassword]
  );
};

const changeToAdmin = async (username) => {
  await pool.query(
    `
      UPDATE users
        SET isAdmin = true
      WHERE username = $1
    `,
    [username]
  );
};

const changeToMember = async (id) => {
  console.log(id);
  await pool.query(
    `
      UPDATE users 
        SET isMember = true 
      WHERE id = $1
    `,
    [id]
  );
};

const addNewPost = async ({ title, message, id }) => {
  await pool.query(
    `
      INSERT INTO messages (title, message, timestamp, userId) 
      VALUES ($1, $2, (SELECT NOW()), $3);
    `,
    [title, message, id]
  );
};

export {
  getUserByUsername,
  addUser,
  changeToAdmin,
  changeToMember,
  addNewPost,
};
