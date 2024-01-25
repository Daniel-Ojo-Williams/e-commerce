import db from "../db/connectdb.js";

class Sessions {
  constructor(
    user_id,
    refresh_token,
    refresh_token_exp,
    user_agent,
    ip_address,
    device_type,
    browser,
    os
  ) {
    this.user_id = user_id;
    this.refresh_token = refresh_token;
    this.refresh_token_exp = refresh_token_exp;
    this.user_agent = user_agent;
    this.ip_address = ip_address;
    this.device_type = device_type;
    this.browser = browser;
    this.os = os;
  }

  async createSession() {
    const query = `INSERT INTO sessions (user_id,
      refresh_token,
      refresh_token_exp,
      user_agent,
      ip_address,
      device_type,
      browser,
    os) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const { rows } = await db.query(query, [
      this.user_id,
      this.refresh_token,
      this.refresh_token_exp,
      this.user_agent,
      this.ip_address,
      this.device_type,
      this.browser,
      this.os,
    ]);

    return rows[0];
  }

  static async getSession(sessionId) {
    const query = `SELECT * FROM sessions WHERE sid = $1`;

    const { rows } = await db.query(query, [sessionId]);
    return rows[0];
  }

  static async updateSession(sessionId, keys, values) {
    const query = `UPDATE sessions SET ${keys} WHERE sid = $${keys.length + 1}`;

    await db.query(query, [...values, sessionId]);
  }

  static async invalidateSession(sessionId) {
    const query = `UPDATE sessions SET is_valid = false, invalidated_at = now(), blocked_at = now() WHERE sid = $1`;
    await db.query(query, [sessionId]);
  }
}

export default Sessions;
