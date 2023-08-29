const express = require('express');
const cookieParser = require('cookie-parser')
const { handleEndPoints } = require('./extras/endPoints.js')


const app = express();

app.use(cookieParser())

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8000;
console.log(process.env.PORT);

// const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./utils/pino");

require("./database/database");

// const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", require("./routes/db.route.js"));

app.get("/", handleEndPoints);

app.listen(PORT, (err) => {
  if (err) logger.error(err);
  else logger.info(`Server up and running at ${PORT}`);
});
