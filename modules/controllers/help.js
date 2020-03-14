const config = require("../../config.json");
const Discord = require("discord.js");

const showCommands = function (msg) {
    let helpMsg = new Discord.RichEmbed()
    .setColor(0x000099)
    .setTitle(`${config.botName} Commands`)
    .setDescription(`${config.botName} will listen to these commands if typed with a !, ., or & typed before them, like !help.`);

    Object.keys(commands).forEach(cmd => {
        let commandDescription = commands[cmd].description;
        let aliases = cmd.split(",");
        helpMsg.addField(aliases, commandDescription, true);
    });
    
    msg.channel.send(helpMsg);
};

module.exports = {
    showCommands
};