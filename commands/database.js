const DatabaseController = require('../controllers/database');

module.exports = {
    name: 'database',
    description: 'Create a database for bucksy to use for persistent storage (only needs to be run once on a server)',
    aliases: ['db'],
    usage: '',
    modOnly: true,
    execute(msg, args) {
        try {
            DatabaseController.createDatabase();
        } catch (error) {
            console.error(error);
        }
    },
};