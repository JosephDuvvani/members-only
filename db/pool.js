import pg from "pg";
import { configDotenv } from "dotenv";

configDotenv();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { pool };
