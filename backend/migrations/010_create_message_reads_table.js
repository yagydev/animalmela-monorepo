exports.up = function(knex) {
  return knex.schema.createTable('message_reads', function(table) {
    table.uuid('message_id').references('id').inTable('messages').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('read_at').defaultTo(knex.fn.now());
    table.primary(['message_id', 'user_id']);

    // Indexes
    table.index(['user_id']);
    table.index(['read_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('message_reads');
};
