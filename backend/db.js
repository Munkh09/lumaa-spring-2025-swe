const {Pool} = require('pg');

// connecting to the postgresql server on my local computer
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'Munkh2000.',
    database: 'demodb'
});

module.exports = pool;