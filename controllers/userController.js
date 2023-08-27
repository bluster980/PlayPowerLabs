const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require("../utils/pino");
const db = require('../database/database');
const queries = require('../database/queries');

const handleRegister = async (req, res, db) => {
    const {username, password, role} = req.body;
    if (!username || !password || !role) {
        return res.status(400).json('Every Field Required');
    }
    try{
        const userExists = await checkUserExists(username);
        if (userExists) {
            return res.status(400).json('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const check = await insertUser(username, hashedPassword, role);
        consoleq.log(check);

        //Generate JWT Token
        const token = jwt.sign({username: username, role: role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        console.log(token);

        //seting token in cookie
        res.cookie('Jwt', token).json({ message: 'User inserted successfully!', token: token });
    }catch(error){
        console.log(error);
        res.status(400).json({message: err.message});
    }
};

const handleLogin = async (req, res, db) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json('Every Field Required');
    }
    try{
        const userExist = await checkUser(username, password);
        if(userExist){
            //Generate JWT Token
            const token = jwt.sign({username: username, role: role}, process.env.JWT_SECRET, {expiresIn: '1h'});
            console.log(token);

            //seting token in cookie
            res.cookie('Jwt', token).json({ message: 'Login Successful!', token: token });
        }else{
            res.status(400).json({message: 'Invalid Credentials'});
        }
    }catch(error){
        console.log(error);
        res.status(400).json({message: 'Error Logging In'});

    }
};

const getUsers = async (req, res) => {
    logger.info(`${req.method}: ${req.originalUrl}`);
    const dbInstance = await db.getInstance();
    
    try {
        const result = await dbInstance.query(queries.getAllUsers()); // Use the query function from queries.js
        logger.info(result.rows);
        res.send({ data: result.rows });
    } catch (error) {
        logger.error(error);
        res.status(400).send({ data: [] });
      } finally {
        dbInstance.release();
      }
};

module.exports = {
    handleRegister,
    handleLogin,
    getUsers,
};
