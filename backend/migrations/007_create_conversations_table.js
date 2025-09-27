exports.up = function(knex) {
  return knex.schema.createTable('conversations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title', 255);
    table.enum('type', ['direct', 'group', 'service']).defaultTo('direct');
    table.jsonb('metadata').defaultTo('{}');
    table.boolean('active').defaultTo(true);
    table.timestamp('last_message_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['type']);
    table.index(['active']);
    table.index(['last_message_at']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('conversations');
};
