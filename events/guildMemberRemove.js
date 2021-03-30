const greetingController = require("../controllers/greeting.js");

module.exports = {
  name: "guildMemberRemove",
  once: false,
  execute(member, bot) {
    console.log(member);
    greetingController.sayHello(member);
    bot.log.info(`Sending a warm greeting to new user: ${member}`);
  },
};
