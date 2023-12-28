import db from "../db/connectdb.js";

class Cart {
  constructor(userId){
    this.userId = userId;
  }

  // create Cart
  async createCart(userId){
    const query = `INSERT INTO cart (userId) VALUES ($1) RETURNING *`

    const { rows } = await db.query(query, [userId]);

    return rows[0];
  }
  // add to cart
  // remove from cart
}

export default Cart;