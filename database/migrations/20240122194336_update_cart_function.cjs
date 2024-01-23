
exports.up = function(knex) {
  return knex.raw(
    `/* Replace with your SQL commands */
CREATE
OR REPLACE FUNCTION cart_checkout_update() RETURNS TRIGGER AS $$ 
BEGIN -- Update cart checkout column based on insert into cart_items quantity column
UPDATE
  cart c
SET
  summary = (
    SELECT
      COALESCE(SUM(ci.quantity * p.price), 0)
    FROM
      cart_items ci
      JOIN products p ON ci.product_id = p.id
    WHERE
      ci.cart_id = NEW.cart_id
  )
WHERE
  c.id = NEW.cart_id;

RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION cart_checkout_update_price() RETURNS TRIGGER AS $$ 
BEGIN IF TG_OP = 'UPDATE'
AND NEW.price <> OLD.price THEN
UPDATE
  cart c
SET
  summary = (
    SELECT
      COALESCE(SUM(ci.quantity * p.price), 0)
    FROM
      cart_items ci
      JOIN products p ON ci.product_id = p.id
    WHERE
      ci.cart_id = c.id
  )
WHERE
  EXISTS (
    SELECT
      1
    FROM
      cart_items ci
    WHERE
      ci.cart_id = c.id
  );

END IF;

RETURN NULL;

END;

$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER update_cart_checkout_price
AFTER
UPDATE
  OF PRICE ON PRODUCTS FOR EACH ROW EXECUTE FUNCTION cart_checkout_update_price();

CREATE
OR REPLACE TRIGGER update_cart_checkout_insert
AFTER
INSERT
  ON cart_items FOR EACH ROW EXECUTE FUNCTION cart_checkout_update();

CREATE
OR REPLACE TRIGGER update_cart_checkout_update
AFTER
UPDATE
  OF quantity ON cart_items FOR EACH ROW EXECUTE FUNCTION cart_checkout_update();`
  );
};

exports.down = function(knex) {
  
};
