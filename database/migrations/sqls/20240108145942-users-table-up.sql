/* Replace with your SQL commands */
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