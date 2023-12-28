import db from "../db/connectdb.js";

class Cart {
  constructor(userId){
    this.userId = userId;
  }

  // create Cart
  async createCart(){
    const query = `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`

    const { rows } = await db.query(query, [this.userId]);

    return rows[0];
  }
}

export default Cart;