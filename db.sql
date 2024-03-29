--using an anonymous code block, create a view (user_info) that holds all columns in users table except the password column
DO $$
  DECLARE column_list text; --declare a variable to hold all the list of column names in the users table
BEGIN
  SELECT string_agg(column_name, ',')
  INTO column_list
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name != 'password';
  
  EXECUTE format('CREATE VIEW user_info AS SELECT %s FROM users', column_list);
END $$;

insert into
  order_items (
    product_id,
    product_name,
    price_per_unit,
    quantity,
    order_id
  )
select
  p.id,
  p.name,
  p.price,
  ci.quantity
from
  products p
  join cart_items ci on p.id = ci.product_id
  join orders on user_id = $1
where
  ci.cart_id = $2