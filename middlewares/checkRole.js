const jwt = require('jsonwebtoken');

const teacherOnly = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized: No token provided.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized: Invalid token.' });
    }
    if (decoded.ro_Le !== 'teacher') {
      return res.status(403).send({ message: 'Forbidden: You do not have permission. you are not a teacher' });
    }
    next();
  });
};

const studentOnly = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized: No token provided.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log(decoded);
        if (err) {
            return res.status(401).send({ message: 'Unauthorized: Invalid token.' });
        }
        if (decoded.ro_Le !== 'student') {
            return res.status(403).send({ message: 'Forbidden: You do not have permission. you are not a student.' });
        }
        next();
    });
};


module.exports = { teacherOnly, studentOnly};