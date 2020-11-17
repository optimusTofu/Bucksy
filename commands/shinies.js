const DatabaseController = require('../controllers/database');

module.exports = {
    name: 'shinies',
    description: 'Create a shinies collection for bucksy to store shiny pokemon names',
    usage: '',
    modOnly: true,
    execute(msg, args) {
        try {
            DatabaseController.createShiniesCollection();
        } catch (error) {
            console.error(error);
        }
    },
};