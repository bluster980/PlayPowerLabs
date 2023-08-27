const pg = require('pg');
const logger = require("../utils/pino");
const fs = require('fs');

logger.info("Pool Creating...");
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: toString(process.env.DB_PASSWORD),
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./database/root.crt').toString(),
    },
    max: 20,
});
async function getInstance() {
    const dbInstance = await pool.connect();
    return dbInstance;
  }
  
  module.exports = {
    getInstance,
  };
