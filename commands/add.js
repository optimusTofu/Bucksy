const DatabaseController = require('../controllers/database');

module.exports = {
    name: 'add',
    description: 'Add a shiny to the shinies collection',
    usage: '',
    modOnly: true,
    execute(msg, args) {
        try {
            DatabaseController.addShiny(msg, args);
        } catch (error) {
            console.error(error);
        }
    },
};