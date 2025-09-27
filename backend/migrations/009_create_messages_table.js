exports.up = function(knex) {
  return knex.schema.createTable('messages', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
    table.uuid('sender_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.enum('message_type', ['text', 'image', 'file', 'location', 'system']).defaultTo('text');
    table.jsonb('metadata').defaultTo('{}');
    table.boolean('edited').defaultTo(false);
    table.timestamp('edited_at');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('deleted_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['conversation_id']);
    table.index(['sender_id']);
    table.index(['message_type']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
