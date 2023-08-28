const { getCurrentDateTime } = require('../extras/timeFormatter.js');

const queries = {
    checkDbInstance: () => {
        const checkDbConnection = `
            SELECT * FROM public.test
            ORDER BY "values" ASC
            `;
        return checkDbConnection;
    },
    getAllUsers: () => {
        const getUsers = `
            SELECT * FROM users
            `;
        return getUsers;
    },
    createUser: (username, password, role) => {
        const createUser = `
            INSERT INTO users (username, password, role)
            VALUES ('${username}', '${password}', '${role}')
            `;
        return createUser;
    },
    getUserByUsername: (username) => {
        const getUserByUsername = `
            SELECT * FROM users
            WHERE username = '${username}'
            `;
        return getUserByUsername;
    },
    getAssignmentById: (id) => {
        const getAssignmentById = `
            SELECT * FROM assignment
            WHERE id = ${id}
            `;
        return getAssignmentById;
    },
    createAssignment: (published_by, title, description, due_date, points) => {
        const createAssignment = `
            INSERT INTO assignment (published_by, title, description, due_date, published_at, points)
            VALUES ('${published_by}', '${title}', '${description}', '${due_date}', '${getCurrentDateTime()}', '${points}')
            RETURNING id;`;
        return createAssignment;
    },

    assignStudents: (assignment_id, teacher_id, student_id) => {
        console.log(assignment_id, teacher_id, student_id);
        const assignStudents = `
            INSERT INTO assignedstudents (id,teacher_id, student_id)
            VALUES ('${assignment_id}', '${teacher_id}', '${student_id}')
            `;
        return assignStudents;
    },
    updateAssignment: (assignment) => {
        console.log(assignment);
        const updateAssignment = `
            UPDATE assignment
            SET title = '${assignment.title}', 
                description = '${assignment.description}', 
                due_date = '${assignment.due_date}',
                points = ${assignment.points}
            WHERE id = ${assignment.assignment_id};
            `;
        return updateAssignment;
    },
    deleteAssignment: (id) => {
        const deleteAssignment = `
            DELETE FROM assignment
            WHERE id = ${id}
            `;
        return deleteAssignment;
    },
    createSubmission: (student_id, assignment_id, details) => {
        const createSubmission = `
            INSERT INTO submission (student_id, assignment_id, details, submitted_at)
            VALUES ('${student_id}', '${assignment_id}' , '${details}' , '${getCurrentDateTime()}')
            RETURNING submission_id, assignment_id`;

        return createSubmission;
    },
    updateAssignedStudents: (assignment_id, submission_id, student_id) => {
        const updateAssignedStudents = `
            UPDATE assignedstudents 
            SET submission_id = '${submission_id}'
            WHERE student_id = '${student_id}' AND id = '${assignment_id}'`;
        return updateAssignedStudents;
    }
};

module.exports = queries;