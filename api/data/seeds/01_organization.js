
exports.seed = function (knex) {
  // Inserts seed entries
  return knex('organizations').insert([
    { id: 1, name: 'Technical', created_at: new Date(), is_active: true },
    { id: 2, name: 'Optional', created_at: new Date(), is_active: true },
    { id: 3, name: 'Educational', created_at: new Date(), is_active: true }
  ]);
};
