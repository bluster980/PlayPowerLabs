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
    }
};

module.exports = queries;