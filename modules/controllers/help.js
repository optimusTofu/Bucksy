const config = require("../../config.json");
const commandController = require("./commands.js");
const Discord = require("discord.js");

const showCommands = function (msg) {
    console.log(this, commandController);
    let helpMsg = new Discord.RichEmbed()
    .setColor(0x000099)
    .setTitle(`${config.botName} Commands`)
    .setDescription(`${config.botName} will listen to these commands if typed with a !, ., or & typed before them, like !help.`);

    // Object.keys(commands).forEach(cmd => {
    //     let commandDescription = commands[cmd].description;
    //     let aliases = cmd.split(",");
    //     helpMsg.addField(aliases, commandDescription, true);
    // });
    
    // msg.channel.send(helpMsg);
};

module.exports = {
    showCommands
};