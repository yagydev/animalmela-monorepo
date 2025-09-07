exports.up = function(knex) {
  return knex.schema.createTable('pet_photos', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE');
    table.string('url', 500).notNullable();
    table.string('alt_text', 255);
    table.boolean('is_primary').defaultTo(false);
    table.integer('order_index').defaultTo(0);
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['pet_id']);
    table.index(['is_primary']);
    table.index(['order_index']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pet_photos');
};
