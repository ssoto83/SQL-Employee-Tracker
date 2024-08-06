const {Client} = require('pg');

const client = new Client ({
    user: 'postgres',
    host: 'localhost',
    database: 'employees_db',
    password: 'admin',
    port: 5432,
});

client.connect();

module.exports = client;