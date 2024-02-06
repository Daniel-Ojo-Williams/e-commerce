
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS orders (
  order_id uuid NOT NULL default uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES users (user_id),
  cart_id int REFERENCES cart (id),
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMPTZ
);

CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'canceled');

ALTER TABLE orders ADD COLUMN order_status order_status default 'pending';`
  );
};

exports.down = function(knex) {
  
};
