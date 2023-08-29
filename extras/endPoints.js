// Define an array to store all the project endpoints
const projectEndpoints = [
    { method: 'GET', path: '/check', description: 'Check a database' },
    { method: 'GET', path: '/users', description: 'users of the database' },
    { method: 'GET', path: '/signup', description: 'Create a new user entry' },
    { method: 'POST', path: '/login', description: 'login an existing user entry' },
    { method: 'POST', path: '/assignment-create', description: 'create a assignment entry' },
    { method: 'PUT', path: '/assignment-update', description: 'update a assignment entry' },
    { method: 'DELETE', path: '/assignment-delete', description: 'delete a assignment entry' },
    { method: 'POST', path: '/assignment-submission', description: 'Submit the assignment' }
  ];
  

const handleEndPoints = (req, res) => {
    res.json(projectEndpoints);
  }

module.exports = {
    handleEndPoints,
}
    