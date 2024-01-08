/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  product_id INT references products(id),
  cart_id INT references cart(id),
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ default now(),
  modified_at TIMESTAMPTZ
)