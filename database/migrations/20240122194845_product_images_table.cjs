
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  image_url VARCHAR(255)[],
  created_at TIMESTAMPTZ DEFAULT now(),
  modified_at TIMESTAMPTZ
)`
  );
};

exports.down = function(knex) {
  
};
