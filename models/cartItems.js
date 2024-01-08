import db from "../db/connectdb.js";


class CartItems{
  constructor(productId, cartId, quantity){
    this.productId = productId,
    this.cartId = cartId,
    this.quantity = quantity
  }

  async addItemToCart(){
    const query = `INSERT INTO cart_items (product_id, cart_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (product_id, cart_id) DO UPDATE SET quantity = cart_items.quantity + $3, modified_at = now() RETURNING *`;

    const { rows } = await db.query(query, [this.productId, this.cartId, this.quantity]);
    return rows[0];
  }

  static async removeFromCart(productId, cartId){
    const query = `DELETE FROM cart_items WHERE product_id = $1  and cart_id = $2`;
    const { rowCount } = await db.query(query, [productId, cartId]);
    return rowCount;
  }

  static async increaseProductQuantity(productId, cartId){
    const query =`UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = $1 and product_id = $2 RETURNING *`;
    const { rows } = await db.query(query, [cartId, productId]);
    return rows[0];
  }

  static async decreaseProductQuantity(productId, cartId){
    const query =`UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = $1 and product_id = $2 RETURNING *`;
    const { rows } = await db.query(query, [cartId, productId]);
    return rows[0];
  }
}

export default CartItems;