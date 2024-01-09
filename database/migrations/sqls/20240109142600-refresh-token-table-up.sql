/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS rfts(
rft_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID NOT NULL UNIQUE REFERENCES users(user_id),
rft_hash VARCHAR(60) NOT NULL,
expires_in TIMESTAMP
)