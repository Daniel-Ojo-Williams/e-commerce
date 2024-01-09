import db from "../db/connectdb.js";

class RefreshToken{

  static async save(userId, rft_hash, expires){
    const query =
      ` INSERT INTO 
        rfts (user_id, rft_hash, expires_in) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (user_id)
        DO UPDATE 
          SET rft_hash = EXCLUDED.rft_hash, expires_in = EXCLUDED.expires_in`;
    const { rows } = await db.query(query, [userId, rft_hash, expires])
  }

  static async getReFreshToken(userId){
    const query = 'SELECT * FROM rfts WHERE user_id = $1';
    const { rows } = await db.query(query, [userId]);
    return rows[0];
  }

  static async deleteReFreshToken(userId){
    const query = 'DELETE FROM rfts WHERE user_id = $1';
    const { rows } = await db.query(query, [userId]);
  }
}

export default RefreshToken;