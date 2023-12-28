import db from "../db/connectdb";


class CartItems{
  constructor(productId, cartId, quantity, price){
    this.productId = productId,
    this.cartId = cartId,
    this.quantity = quantity,
    this.price = price
  }

  async addItemToCart(){
    const query = `INSERT INTO cart_items (product_id, cart_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *`;

    const { rows } = db.query(query, [this.productId, this.cartId, this.quantity, this.price]);
    return rows[0];
  }

  static async removeFromCart(productId){

  }

  static async updateProductQuantity(productId){

  }
}

export default CartItems;