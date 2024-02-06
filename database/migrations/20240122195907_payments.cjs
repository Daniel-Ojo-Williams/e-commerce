
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS payments (
  payment_id uuid default gen_random_uuid() primary key,
  order_id uuid references orders (order_id),
  user_id uuid references users(user_id),
  amount decimal(10,2),
  account_no int(11),
  created_at timestamptz default current_timestamp,
  provider
)`
  );
};

exports.down = function(knex) {
  
};
