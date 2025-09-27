exports.up = function(knex) {
  return knex.schema.createTable('pets', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.enum('species', ['dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other']).notNullable();
    table.string('breed', 100);
    table.integer('age');
    table.decimal('weight', 5, 2);
    table.enum('gender', ['male', 'female', 'unknown']);
    table.boolean('neutered').defaultTo(false);
    table.text('description');
    table.jsonb('health_info').defaultTo('{}');
    table.jsonb('behavior_traits').defaultTo('{}');
    table.boolean('available_for_adoption').defaultTo(false);
    table.decimal('adoption_fee', 10, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['owner_id']);
    table.index(['species']);
    table.index(['breed']);
    table.index(['available_for_adoption']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pets');
};
