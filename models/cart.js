import db from "../db/connectdb.js";

class Cart {
  constructor(userId){
    this.userId = userId;
  } 

  // retrieve Cart id 
  static async getCartId(userId){
    const query = `SELECT id FROM cart WHERE user_id = $1`

    const { rows } = await db.query(query, [userId]);

    return rows[0];
  }

  static async viewCart(cartId){
    const query = `
    SELECT ci.product_id AS product_id, ci.quantity, p.name, p.price, ci.quantity * p.price AS total_price
    FROM cart_items ci 
    JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1
    `;

    const checkoutQuery = `
    SELECT checkout
    FROM cart
    WHERE cart.id = $1
    `

    const { rows: checkout } = await db.query(checkoutQuery, [cartId])
    const { rows } = await db.query(query, [cartId]);
    return { checkout, rows };
  }
}

export default Cart;