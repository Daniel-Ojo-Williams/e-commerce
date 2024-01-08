/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS "order"(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE
)