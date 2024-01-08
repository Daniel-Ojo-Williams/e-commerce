/* Replace with your SQL commands */
-- create a trigger that  automatically creates an entry in the cart table for each new user created.

CREATE OR REPLACE FUNCTION create_cart_entry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cart (user_id) VALUES (NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_user_cart_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_cart_entry();