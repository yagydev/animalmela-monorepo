exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('name', 255).notNullable();
    table.string('phone', 20);
    table.string('avatar_url', 500);
    table.enum('user_type', ['pet_owner', 'service_provider', 'breeder', 'admin']).defaultTo('pet_owner');
    table.boolean('verified').defaultTo(false);
    table.boolean('email_verified').defaultTo(false);
    table.boolean('phone_verified').defaultTo(false);
    table.jsonb('preferences').defaultTo('{}');
    table.string('stripe_customer_id');
    table.string('stripe_account_id');
    table.timestamp('last_login');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['email']);
    table.index(['user_type']);
    table.index(['verified']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
