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
    await createProductTable();
    await createCartTable();
    await createCartItemsTable();
  } catch (error) {
    console.log(error);
  }
}

const createUsersTable = async () => {
  try {
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
    
  } catch (error) {
    console.log(error.message)
  }
}

const createProductTable = async()=>{
  try {
    const createTable = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      description VARCHAR(255),
      price DECIMAL,
      quantity INT,
      discount_id INT,
      image_url VARCHAR(255)[],
      tags TEXT[],
      created_at TIMESTAMPTZ default now(),
      modified_at TIMESTAMPTZ 
    )
    `;
  
    await db.query(createTable)
    
  } catch (error) {
    console.log(error.message)
  }
}

const createCartTable = async () => {
  try {
    const createTable = `
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INT,
      created_at TIMESTAMPTZ default now(),
      modified_at TIMESTAMPTZ,
      CONSTRAINT fk_users
        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
    )
    `;
  
    await db.query(createTable);
  } catch (error) {
    console.log(error.message);
  }
}

const createCartItemsTable = async () => {
  try {

    const createTable =`
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      product_id INT references products(id),
      cart_id INT references cart(id),
      quantity INT,
      price DECIMAL,
      created_at TIMESTAMPTZ default now(),
      modified_at TIMESTAMPTZ
    )
    `
    await db.query(createTable);
    
  } catch (error) {
    console.log(error.message);
  }
};


export default db;