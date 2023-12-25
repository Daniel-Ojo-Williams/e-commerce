import pkg from "pg";
import { asyncWrapper } from "../utils/index.js";
const { Pool } = pkg;
import 'dotenv/config'


const connectionString =
  "postgres://ecbtlwpu:rw50bMQCOKPe1bAC9K5FyVNM0v-3BtLU@drona.db.elephantsql.com/ecbtlwpu";

const db =  new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

export const initDb = async() => {
  try {
    console.log('Connected to database')
    await createUsersTable();
  } catch (error) {
    console.log(error)
  }
}

const createUsersTable = async () => {
  const createTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(255),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(50),
    avatar VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    modified_at TIMESTAMPTZ
  )
  `

  await db.query(createTable)
}

const createProductTable = async()=>{
  const createTable = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    
  )
  `
}


export default db