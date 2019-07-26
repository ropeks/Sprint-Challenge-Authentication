const knex = require('knex');
const db = require("./../database/dbConfig");

function addUser(user) {
    return db('users')
        .insert(user, 'id')
        .then(ids => {
            const [id] = ids;
            return getUser(id);
        });
}

function getUser(id) {
    return db('users')
      .where({ id })
      .first();
}

module.exports = {
    getUser,
    addUser
};