exports.up = function(knex) {
  return knex.schema.createTable('services', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('provider_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description');
    table.enum('service_type', [
      'pet_sitting',
      'dog_walking',
      'grooming',
      'training',
      'veterinary',
      'boarding',
      'pet_taxi',
      'pet_photography',
      'pet_massage',
      'pet_yoga',
      'other'
    ]).notNullable();
    table.decimal('price', 10, 2);
    table.string('currency', 3).defaultTo('USD');
    table.decimal('location_lat', 10, 8);
    table.decimal('location_lng', 11, 8);
    table.text('address');
    table.jsonb('availability').defaultTo('{}');
    table.jsonb('service_areas').defaultTo('[]');
    table.boolean('verified').defaultTo(false);
    table.boolean('active').defaultTo(true);
    table.jsonb('requirements').defaultTo('{}');
    table.jsonb('photos').defaultTo('[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['provider_id']);
    table.index(['service_type']);
    table.index(['verified']);
    table.index(['active']);
    table.index(['location_lat', 'location_lng']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('services');
};
