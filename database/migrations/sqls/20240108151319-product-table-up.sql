/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  description VARCHAR(255),
  price DECIMAL,
  quantity INT,
  discount_id INT,
  image_url VARCHAR(255) [],
  tags TEXT [],
  created_at TIMESTAMPTZ default now(),
  modified_at TIMESTAMPTZ
)