import db from "../db/connectdb.js";

class Users {
  constructor(username, password, email, last_name, first_name) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.last_name = last_name;
    this.first_name = first_name;
  }

  // get user
  static async getUser(userId){
    const query = `SELECT * FROM user_info WHERE id = $1`;
    const { rows } = await db.query(query, [userId]);
    return rows[0]
  }

  // get all users
  static async getAllUsers(offset=0, fetch=10){
    // --- Get total number of users in users table (user_info view) ---
    const { rows } = await db.query(`SELECT COUNT(*) FROM user_info`);
    const { count: total } = rows[0];
    const query = `SELECT * FROM user_info ORDER BY id ASC OFFSET $1 FETCH FIRST $2 ROWS ONLY `;
    const { rows: users } = await db.query(query, [offset, fetch]);
    return { users, total };
  }
  // create a new user
  async save(){
    const query = `INSERT INTO users (username, email, password, last_name, first_name) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const { rows } = await db.query(query, [this.username, this.email, this.password, this.last_name, this.first_name]);
    return rows[0]
  }
  // update user
  static async updateUser(userId, keys, values){
    const query = `
    UPDATE users
    SET ${keys}, modified_at = now() WHERE id = $${values.length + 1}
    RETURNING *
    `
    const { rows } = await db.query(query, [...values, userId])
    return rows[0]
  }
  // change password

  // delete user
  static async deleteUser(userId){
    const query = `DELETE FROM users WHERE id = $1`

    const response = await db.query(query, [userId])

    return response.rows
  }
}

export default Users