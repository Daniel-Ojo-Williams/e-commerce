
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  product_id INT references products(id),
  cart_id INT references cart(id),
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ default now(),
  modified_at TIMESTAMPTZ
)`
  ).then(() => {
    return knex.raw(
      `ALTER TABLE
        cart_items
        ADD
        CONSTRAINT unique_product_cart UNIQUE (product_id, cart_id)`
    );
  });
};

exports.down = function(knex) {
  
};
