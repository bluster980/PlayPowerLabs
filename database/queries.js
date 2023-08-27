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
};

module.exports = queries;