const DatabaseController = require('../controllers/database');

module.exports = {
    name: 'users',
    description: 'Create a users collection for bucksy to store user points',
    usage: '',
    modOnly: true,
    execute(msg, args) {
        try {
            DatabaseController.createUsersCollection();
        } catch (error) {
            console.error(error);
        }
    },
};