const config = require("../../config.json");
const DatabaseController = require("../../controllers/database");

module.exports = {
  name: "shinies",
  description: "Gets a list of all pokemon that Bucksy knows can be shiny.",
  usage: "",
  modOnly: true,
  guildOnly: true,
  args: false,
  channel: {
    id: config.channels.admin.id,
    name: config.channels.admin.name,
  },
  execute(msg) {
    DatabaseController.getShinies().then((data) => {
        msg.reply('The following list are which pokemon I know can be shiny: ``` '+data+' ``` ');
    }).catch((err) => {
        console.error(err);
    });
  },
};
