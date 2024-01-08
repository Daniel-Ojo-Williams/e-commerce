import pkg from "pg";
import { asyncWrapper } from "../utils/index.js";
const { Pool } = pkg;
import "dotenv/config";

const connectionString =
  "postgres://ecbtlwpu:rw50bMQCOKPe1bAC9K5FyVNM0v-3BtLU@drona.db.elephantsql.com/ecbtlwpu";

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const initDb = async () => {
  try {
    console.log("Connected to database");

  } catch (error) {
    console.log(error);
  }
};

export default db;
