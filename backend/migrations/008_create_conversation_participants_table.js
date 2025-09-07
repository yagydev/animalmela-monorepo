exports.up = function(knex) {
  return knex.schema.createTable('conversation_participants', function(table) {
    table.uuid('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('role', ['participant', 'admin', 'moderator']).defaultTo('participant');
    table.boolean('muted').defaultTo(false);
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.timestamp('left_at');
    table.primary(['conversation_id', 'user_id']);

    // Indexes
    table.index(['user_id']);
    table.index(['role']);
    table.index(['joined_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('conversation_participants');
};
