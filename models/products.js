import db from "../db/connectdb.js";

class Products{
  constructor(name, description, price, quantity, image_url, tags){
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.image_url = image_url;
    this.tags = tags;
  };

  // create a new product
  async saveProduct (){
    const query = `
    INSERT INTO products (
      name,
      description,
      price,
      quantity,
      image_url,
      tags
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    ) RETURNING *
    `;
    const { rows } = await db.query(query, [this.name, this.description, this.price, this.quantity, this.image_url, this.tags]);

    return rows[0];
  };

  // get a product
  static async getProduct(productId) {
    const query = `SELECT * FROM products WHERE id = $1`;

    const { rows } = await db.query(query, [productId]);
    return rows[0];
  };

  // get all products
  static async getAllProducts(offset=0) {
    const { rows: count } = await db.query(`SELECT COUNT(*) FROM products`);
    
    const { count: total } = count[0];
    
    const query = `SELECT * FROM products ORDER BY name ASC LIMIT 10 OFFSET $1`;
    
    const { rows: products } = await db.query(query, [offset]);
    return { products, total}
  };

  // update product
  static async updateProduct(productId, keys, values){
    const query = `
    UPDATE products
    SET ${keys}, modified_at = now() WHERE id = $${values.length + 1}
    RETURNING *
    `;
    const { rows } = await db.query(query, [...values, productId]);
    return rows[0];
  };

  // delete product
  static async deleteProduct(productId){
    const query = `DELETE FROM products WHERE id = $1`;

    const { rowCount } = await db.query(query, [productId]);
    
    return rowCount;
  };
}

export default Products;