
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS "sessions" (
      "sid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" uuid NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
      "refresh_token" varchar UNIQUE NOT NULL,
      "refresh_token_exp" timestamptz NOT NULL,
      "browser" json,
      "device_type" json,
      "os" json,
      "user_agent" text NOT NULL,
      "ip_address" inet NOT NULL,
      "created_at" timestamptz DEFAULT (now()),
      "updated_at" timestamptz,
      "is_valid" boolean DEFAULT true,
      "invalidated_at" timestamptz,
      "last_active_at" timestamptz,
      "blocked_at" timestamptz
    );
    `
  );
};

exports.down = function(knex) {
  
};
