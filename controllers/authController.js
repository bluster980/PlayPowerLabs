const db = require("../database/database");
const logger = require("../utils/pino");
const queries = require("../database/queries");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const signUp = async (req, res) => {
    logger.info(`${req.method}: ${req.originalUrl}`);
    const { username, password, role } = req.body;
    const dbInstance = await db.getInstance();
  
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the user into the database
      const result = await dbInstance.query(queries.createUser(username, hashedPassword, role));
      logger.info(result);
  
        const token = jwt.sign(
            { user_Id: result.insertId, user_Name: username, ro_Le: role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(token);
      res.cookie('jwt', token).json({ message: 'successfully!', token: token });
    //   res.status(201).send({ message: 'Sign-Up Successful.'}); 
    } catch (error) {
      logger.error(error);
      res.status(400).send({ message: 'Failed to SignUp.' });
    } finally {
      dbInstance.release();
    }
  };
  
  const logIn = async (req, res) => {
    logger.info(`${req.method}: ${req.originalUrl}`);
    const { username, password } = req.body;
    const dbInstance = await db.getInstance();

    const token = req.cookies.jwt;
    if(token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            res.send({ message: 'Successfully LoggedIn', user: req.body});
        }
        catch (error) {
            try {
                const result = await dbInstance.query(queries.getUserByUsername(username));
                if (result.rows.length === 0) {
                    return res.status(401).send({ message: 'Invalid username or password.' });
                }
                else {
                    const user = result.rows[0];
                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (!isPasswordCorrect) {
                        return res.status(401).send({ message: 'Invalid username or password.' });
                    }
                    else {
                        const newToken = jwt.sign(
                            { user_Id: user.user_id, user_Name: user.username, ro_Le: user.role },
                            process.env.JWT_SECRET,
                            { expiresIn: '1h' }
                        );
                        console.log(newToken);
                        res.cookie('jwt', newToken).json({ message: 'Successfully Login!', token: newToken });
                        return;
                    }
                }
            }
            catch (error) {
                logger.error(error);
                res.status(500).send({ message: 'Failed to Login' });
            }
            finally {
                dbInstance.release();
            }
        }
    }
    else {
        try {
            const result = await dbInstance.query(queries.getUserByUsername(username));
            if (result.rows.length === 0) {
                return res.status(401).send({ message: 'Invalid username or password.' });
            }
            else {
                const user = result.rows[0];
                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                if (!isPasswordCorrect) {
                    return res.status(401).send({ message: 'Invalid username or password.' });
                }
                else {
                    const newToken = jwt.sign(
                        { user_Id: user.user_id, user_Name: user.username, ro_Le: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    console.log(newToken);
                    res.cookie('jwt', newToken).json({ message: 'successfully Login!', token: newToken });
                    return;
                }
            }
        }
        catch (error) {
            logger.error(error);
            res.status(500).send({ message: 'Failed to Login' });
        }
        finally {
            dbInstance.release();
        }
    }    
}; 
   
  module.exports = { signUp, logIn, };
  
  