/* Replace with your SQL commands */
ALTER TABLE
  products
ADD
  COLUMN IF NOT EXISTS product_images_id INT;
ALTER TABLE 
  products 
ADD 
  COLUMN IF NOT EXISTS proudct_images_total INT;
ALTER TABLE 
  products
ADD CONSTRAINT fk_product_images
FOREIGN KEY (product_images_id)
REFERENCES product_images(id);