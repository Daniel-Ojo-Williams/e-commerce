import db from "../db/connectdb.js";

class Order {
  constructor(userId, cartId) {
    this.userId = userId;
    this.cartId = cartId;
  }

  async createOrder() {
    try {
      await db.query("BEGIN");
      const createOrder = `INSERT INTO orders (user_id, cart_id, total) SELECT user_id, id, summary from cart WHERE id = $1 and user_id = $2`;

      await db.query(createOrder, [this.cartId, this.userId]);

      const createOrderItems = `  INSERT INTO
                    order_items (
                      product_id,
                      product_name,
                      price_per_unit,
                      quantity,
                      order_id
                    )
                    SELECT
                      p.id,
                      p.name,
                      p.price,
                      ci.quantity,
                      o.order_id
                    FROM
                      products p
                      join cart_items ci on p.id = ci.product_id
                      join orders o on ci.cart_id = o.cart_id 
                    WHERE
                      ci.cart_id = $1
                      and o.user_id = $2`;

      await db.query(createOrderItems, [this.cartId, this.userId]);

      await db.query("COMMIT");

      return "Order created successfully";
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
      throw e;
    }
  }

  static async viewOrders(userId){
    const query = 'SELECT order_id FROM orders WHERE user_id = $1'

    const { rows } = await db.query(query, [userId]);

    return rows;
  }

  static async viewOrderItems(orderId){
    const query = `SELECT * FROM order_items WHERE order_id = $1`;

    const { rows } = await db.query(query, [order.order_id]);

    return rows[0];
  }

  static async updateOrderStatus(orderId, status){
    const query = 'UPDATE order_items SET order_status = $1 WEHRE order_id = $2';

    await db.query(query, [status, orderId]);

    return 'success';
  }
}

export default Order;