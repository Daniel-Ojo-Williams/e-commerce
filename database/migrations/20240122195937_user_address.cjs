
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS user_address(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(user_id) on delete cascade,
  first_name varchar(50),
  last_name varchar(50),
  phone varchar(50),
  delivery_address varchar(255),
  city varchar(50),
  state varchar(50)
)`
  );
};

exports.down = function(knex) {
  
};
