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

export { getUserByUsername, addUser };
