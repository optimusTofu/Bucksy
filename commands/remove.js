const DatabaseController = require('../controllers/database');

module.exports = {
    name: 'remove',
    description: 'Remove a shiny from the shinies collection',
    usage: '',
    modOnly: true,
    execute(msg, args) {
        try {
            DatabaseController.removeShiny(msg, args);
        } catch (error) {
            console.error(error);
        }
    },
};