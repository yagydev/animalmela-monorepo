exports.up = function(knex) {
  return knex.schema.createTable('bookings', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('service_id').references('id').inTable('services').onDelete('CASCADE');
    table.uuid('customer_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('provider_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('status', [
      'pending',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show'
    ]).defaultTo('pending');
    table.timestamp('scheduled_date');
    table.timestamp('start_time');
    table.timestamp('end_time');
    table.decimal('total_amount', 10, 2);
    table.string('currency', 3).defaultTo('USD');
    table.enum('payment_status', [
      'pending',
      'paid',
      'refunded',
      'failed'
    ]).defaultTo('pending');
    table.string('stripe_payment_intent_id');
    table.jsonb('special_instructions');
    table.jsonb('cancellation_reason');
    table.timestamp('cancelled_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['service_id']);
    table.index(['customer_id']);
    table.index(['provider_id']);
    table.index(['status']);
    table.index(['scheduled_date']);
    table.index(['payment_status']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bookings');
};
