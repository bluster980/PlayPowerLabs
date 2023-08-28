const db = require("../database/database");
const logger = require("../utils/pino");
const queries = require("../database/queries");
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());


const assignmentCreate = async (req, res) => {
  logger.info(`${req.method}: ${req.originalUrl}`);
  const { title, description, due_date, points, assignedStudents } = req.body;
  const dbInstance = await db.getInstance();
  console.log(req.body);

  // Get the token from the request cookies
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized: No token provided.' });
  }

  // Verify the token and get the user id
  let published_by;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized: Invalid token.' });
    }
    published_by = decoded.user_Id;
  });

  try {
    // Create the assignment and retrieve its ID
    const createAssignmentResult = await dbInstance.query(
      queries.createAssignment(published_by, title, description, due_date, points)
    );
    const assignmentId = createAssignmentResult.rows[0].id; // Retrieve assignment ID from rows[0]

    // Assign the assignment to each student
    for (let student_id of assignedStudents) {
      await dbInstance.query(queries.assignStudents(assignmentId, published_by, student_id));
    }

    res.send({ message: 'Assignment created and assigned successfully!' });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ message: 'Failed to create and assign assignment.' });
  } finally {
    dbInstance.release();
  }
};

const assignmentUpdate = async (req, res) => {
  logger.info(`${req.method}: ${req.originalUrl}`);
  const { assignment_id, title, description, due_date, points } = req.body;
  const dbInstance = await db.getInstance();

  try {
    // First, check if the assignment exists
    let assignment = (await dbInstance.query(queries.getAssignmentById(assignment_id))).rows;
    console.log(assignment);
    if (!assignment.length) {
      res.status(404).send({ message: 'Assignment not found.' });
      return;
    }
    assignment = assignment[0];
    // If the assignment exists, update only the provided attributes
    const updatedAssignment = {
      title: title || assignment.title,
      description: description || assignment.description,
      due_date: due_date || assignment.due_date,
      points: points || assignment.points,
      assignment_id: assignment_id
    };

    const result = await dbInstance.query(queries.updateAssignment(updatedAssignment));
    logger.info(result);
    res.send({ message: 'Assignment updated successfully!'});
  } catch (error) {
    logger.error(error);
    res.status(400).send({ message: 'Failed to update assignment.' });
  } finally {
    dbInstance.release();
  }
};

const assignmentDelete = async (req, res) => {
  logger.info(`${req.method}: ${req.originalUrl}`);
  const { id } = req.body;
  const dbInstance = await db.getInstance();

  try {
    const result = await dbInstance.query(queries.deleteAssignment(id));
    logger.info(result);
    res.send({ message: 'Assignment deleted successfully!' });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ message: 'Failed to delete assignment.' });
  } finally {
    dbInstance.release();
  }
};


const assignmentSubmission = async (req, res) => {
  logger.info(`${req.method}: ${req.originalUrl}`);
  const { assignment_id, details } = req.body;
  const dbInstance = await db.getInstance();

  // Get the token from the request cookies
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized: No token provided.' });
  }

  // Verify the token and get the user id
  let student_id;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized: Invalid token.' });
    }
    student_id = decoded.user_Id;
  });

  try {
    // First, check if the assignment exists
    let assignment = (await dbInstance.query(queries.getAssignmentById(assignment_id))).rows;
    if (!assignment.length) {
      res.status(404).send({ message: 'Assignment not found or removed.' });
      return;
    }
    assignment = assignment[0];

    // Check if the assignment is past due
    const dueDate = new Date(assignment.due_date);
    const currentDate = new Date();
    console.log(dueDate, currentDate);
    if (currentDate > dueDate) {
      res.status(400).send({ message: 'Assignment is past due.' });
      return;
    }


    const result = await dbInstance.query(queries.createSubmission(student_id, assignment_id, details));
    const submission_id = result.rows[0].submission_id; // Get the submission_id of the newly created submission
    await dbInstance.query(queries.updateAssignedStudents(assignment_id,submission_id, student_id));

    logger.info(result);
    res.send({ message: 'Assignment submitted successfully!' });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ message: 'Failed to submit assignment.' });
  } finally {
    dbInstance.release();
  }
};


module.exports = { assignmentCreate, assignmentUpdate, assignmentDelete, assignmentSubmission }
