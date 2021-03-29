const greetingController = require("../controllers/greeting.js");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  execute(bot, member) {
    greetingController.sayHello(member);
    bot.log.info(`Sending a warm greeting to new user: ${member}`);
  },
};
