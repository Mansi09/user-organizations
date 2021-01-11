
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').insert([
    { id: 1, email: 'admin@simform.com', password: "$2a$10$YZ9sD.WJn2asEODtThFhl.f7mmAXIq.5OMTsGOO9yLeQp.8FMByjG", role_id: 1 }
  ]);
};
