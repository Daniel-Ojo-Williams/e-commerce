/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(
    `CREATE TABLE IF NOT EXISTS users (
  user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(50),
  password VARCHAR(255),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(50),
  avatar VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  modified_at TIMESTAMPTZ
)`
  ).then(() => {
    return knex.raw(
        `--using an anonymous code block, create a view (user_info) that holds all columns in users table except the password column
        DO $$ DECLARE column_list text;--declare a variable to hold all the list of column names in the users table
        BEGIN
        SELECT
          string_agg(column_name, ',') INTO column_list
        FROM
          information_schema.columns
        WHERE
          table_name = 'users'
          AND column_name != 'password';

          EXECUTE format(
          'CREATE OR REPLACE VIEW user_info AS SELECT %s FROM users',
          column_list
        );

        END $$`
    )
  }).catch((err) => {
    // console.log(`Gigantic error message hereeeeeeee: ${err.message}`);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};


// knex.schema.createTable("users", (table)=> {
//     table.uuid("user_id", {primaryKey: true}).defaultTo(knex.fn.uuid());
//     table.string("username", 50);
//     table.string("email", 50).unique({indexName: "unique_email", deferrable: "immediate"});
//     table.string("password", 255);
//     table.string("first_name", 50);
//     table.string("last_name", 50);
//     table.string("phone", 50);
//     table.string("avatar", 255);
//     table.boolean("verified").defaultTo(false);
//     table.datetime("created_at").defaultTo(knex.fn.now());
//     table.dateTime("modified_at")