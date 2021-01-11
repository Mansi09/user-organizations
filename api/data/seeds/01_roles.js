
exports.seed = function (knex) {
  // Inserts seed entries
  return knex('roles').insert([
    { id: 1, name: 'admin', created_at: new Date(), "deleted_at": null }
  ]);
};
