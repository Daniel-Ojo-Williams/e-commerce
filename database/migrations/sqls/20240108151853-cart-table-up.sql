/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  summary DECIMAL,
  created_at TIMESTAMPTZ default now(),
  modified_at TIMESTAMPTZ,
  CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)