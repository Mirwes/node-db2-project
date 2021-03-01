// DO YOUR MAGIC

exports.up = function(knex) {
    return knex.schema.createTable('cars', table => {
        table.increments();
        table.string('vin').unique().notNullable();
        table.string('make').notNullable();
        table.string('model').notNullable();
        table.string('mileage').notNullable();
        table.string('transmission');
        table.string('titlestatus');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cars');
};