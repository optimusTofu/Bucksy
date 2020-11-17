const QotdController = require('../controllers/qotd');

module.exports = {
    name: 'ask',
    description: 'Get a popular question of the day from Reddit',
    aliases: ['qotd'],
    usage: '',
    modOnly: true,
    execute(msg, args) {
        try {
            QotdController.ask(msg);
        } catch (error) {
            console.error(error);
        }
    },
};