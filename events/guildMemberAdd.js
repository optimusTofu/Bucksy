const greetingController = require("../controllers/greeting.js");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  execute(member, bot) {
    greetingController.sayHello(member, bot);
    bot.log.info(`Sending a warm greeting to new user: ${member}`);
  },
};
