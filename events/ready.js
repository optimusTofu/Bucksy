const guessController = require("../controllers/guess.js");
const qotdController = require("../controllers/qotd.js");

module.exports = {
  name: "ready",
  once: true,
  execute(bot) {
    qotdController.start(bot);
    guessController.start(bot);
    bot.log.debug(`Logged in as ${bot.user.tag} - ${bot.user.username}!`);
  },
};
