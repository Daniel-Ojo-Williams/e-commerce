/* Replace with your SQL commands */
ALTER TABLE users ADD COLUMN user_id UUID DEFAULT gen_random_uuid();
UPDATE users SET user_id = gen_random_uuid()::uuid;
ALTER TABLE users DROP COLUMN id CASCADE;
ALTER TABLE users ADD PRIMARY KEY (user_id);
