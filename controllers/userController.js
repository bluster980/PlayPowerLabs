const db = require("../database/database");
const logger = require("../utils/pino");
const queries = require("../database/queries");
const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser())

const dotenv = require('dotenv');
dotenv.config();

const getUsers = async (req, res) => {
    logger.info(`${req.method}: ${req.originalUrl}`);
    const dbInstance = await db.getInstance();
  
    try {
      const result = await dbInstance.query(queries.getAllUsers());
      logger.info(result.rows);
      res.send({ data: result.rows });
    } catch (error) {
      logger.error(error);
      res.status(400).send({ data: [] });
    } finally {
      dbInstance.release();
    }
  };

module.exports = {getUsers}