/* Replace with your SQL commands */
CREATE OR REPLACE FUNCTION update_product_images_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET product_images_total = (SELECT array_length(image_url, 1) FROM product_images WHERE product_id = NEW.id) WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_images_total_trigger
AFTER INSERT ON product_images
FOR EACH ROW
EXECUTE FUNCTION update_product_images_total();

