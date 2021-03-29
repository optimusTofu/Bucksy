const greetingController = require("../controllers/greeting.js");

module.exports = {
  name: "guildMemberRemove",
  once: false,
  execute(args, bot) {
    greetingController.sayHello(member);
    bot.log.info(`Sending a warm greeting to new user: ${member}`);
  },
};
