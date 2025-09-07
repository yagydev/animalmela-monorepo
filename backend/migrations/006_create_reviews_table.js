exports.up = function(knex) {
  return knex.schema.createTable('reviews', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('reviewer_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('service_id').references('id').inTable('services').onDelete('CASCADE');
    table.uuid('booking_id').references('id').inTable('bookings').onDelete('CASCADE');
    table.integer('rating').notNullable().checkBetween([1, 5]);
    table.text('comment');
    table.jsonb('rating_breakdown').defaultTo('{}');
    table.boolean('verified').defaultTo(false);
    table.boolean('helpful').defaultTo(false);
    table.integer('helpful_count').defaultTo(0);
    table.jsonb('photos').defaultTo('[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['reviewer_id']);
    table.index(['service_id']);
    table.index(['booking_id']);
    table.index(['rating']);
    table.index(['verified']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reviews');
};
