
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS order_items(
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders (order_id) not null,
  product_name varchar(255) not null,
  product_id int references products (id) on delete set null,
  quantity int,
  price_per_unit decimal(10, 2) not null,
  created_at timestamptz default current_timestamp,
  modified_at timestamptz
)`
  );
};

exports.down = function(knex) {
  
};
