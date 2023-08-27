const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const dbController = require('./controllers/db.controller');
const userController = require('./controllers/userController');
const db = require('./database/database');
const queries = require('./database/queries');

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
        res.send('Hello World!');
    }
);

app.get('/checkdb', dbController.checkDb); 

app.get('/users', userController.getUsers);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}
);