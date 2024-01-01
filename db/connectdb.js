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
    await createUsersTable();
    await createProductTable();
    await createCartTable();
    await createCartItemsTable();
    await extras();
  } catch (error) {
    console.log(error);
  }
};

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
    `;

    await db.query(createTable);
  } catch (error) {
    console.log(error.message);
  }
};

const createProductTable = async () => {
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

    await db.query(createTable);
  } catch (error) {
    console.log(error.message);
  }
};

const createCartTable = async () => {
  try {
    const createTable = `
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INT,
      summary DECIMAL,
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
};

const createCartItemsTable = async () => {
  try {
    const createTable = `
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      product_id INT references products(id),
      cart_id INT references cart(id),
      quantity INT DEFAULT 1,
      created_at TIMESTAMPTZ default now(),
      modified_at TIMESTAMPTZ
    )
    `;

    /* add constraint to have only 
    one product in the cart_items table, 
    if a product with the same product_id is being added again to the same cart the constraint flags it.
    */
    const addContsraint = `
    ALTER TABLE cart_items ADD CONSTRAINT unique_product_cart UNIQUE (product_id, cart_id)
    `;
    await db.query(createTable);
    await db.query(addContsraint);
  } catch (error) {
    console.log(error.message);
  }
};

const extras = async () => {
  try {
    const createFunction = `
      CREATE OR REPLACE FUNCTION cart_checkout_update()
      RETURNS TRIGGER AS $$
      BEGIN
          -- Update cart checkout column based on insert into cart_items quantity column

          UPDATE cart c
          SET checkout = (
            SELECT COALESCE(SUM(ci.quantity * p.price), 0)
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = NEW.cart_id
          )
          WHERE c.id = NEW.cart_id;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION cart_checkout_update_price()
      RETURNS TRIGGER AS $$
      BEGIN 
            IF TG_OP = 'UPDATE' AND NEW.price <> OLD.price THEN
              UPDATE cart c
              SET checkout = (
                SELECT COALESCE(SUM(ci.quantity * p.price), 0)
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = c.id
              ) WHERE EXISTS (
                SELECT 1
                FROM cart_items ci
                WHERE ci.cart_id = c.id
              );
            END IF;
            RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE OR REPLACE TRIGGER update_cart_checkout_price
      AFTER UPDATE OF PRICE ON PRODUCTS
      FOR EACH ROW
      EXECUTE FUNCTION cart_checkout_update_price();

      CREATE OR REPLACE TRIGGER update_cart_checkout_insert
      AFTER INSERT ON cart_items
      FOR EACH ROW
      EXECUTE FUNCTION cart_checkout_update();

      CREATE OR REPLACE TRIGGER update_cart_checkout_update
      AFTER UPDATE OF quantity ON cart_items
      FOR EACH ROW
      EXECUTE FUNCTION cart_checkout_update();

      `;

    await db.query(createFunction);  
  } catch (error) {
    console.log(error.message)
  }
  
};

export default db;
