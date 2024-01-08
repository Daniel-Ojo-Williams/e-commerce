/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  status VARCHAR(50),
  date_created TIMESTAMPTZ
)