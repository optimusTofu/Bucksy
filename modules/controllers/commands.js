"use strict";

const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const roleController = require("./role.js");
const databaseController = require("./database.js");
const pointsController = require("./points.js");
const slotMachineController = require("./slots.js");
const qotdController = require("./qotd.js");

const showCommands = (msg) => {
    let lastPrefix = config.prefix.pop();
    let prefixes = config.prefix.join(", ") + ", or " + lastPrefix;
    let helpMsg = new MessageEmbed()
        .setColor(0x000099)
        .setTitle(`${config.botName} Commands`)
        .setDescription(`${config.botName} will listen to these commands if typed with a ${prefixes} typed before them, like !help.`);

    Object.keys(commands).forEach(cmd => {
        let commandHidden = commands[cmd].hidden;
        let commandDescription = commands[cmd].description;

        if (!commandHidden) {
            helpMsg.addField(cmd, commandDescription, true);

            if (commands[cmd].hasOwnProperty("alias")) {
                helpMsg.addField(commands[cmd].alias, commandDescription, true);
            }
        }
    });

    msg.channel.send(helpMsg);
};

const commands = {
    "iam": {
        "description": `${config.botName} will assign a location role for you.`,
        "callback": roleController.addLocation
    },
    "iamnot": {
        "description": `${config.botName} will remove a location role for you.`,
        "callback": roleController.removeLocation
    },
    "team": {
        "description": `${config.botName} will assign a team role for you.`,
        "callback": roleController.addTeam
    },
    "want": {
        "description": `${config.botName} will assign a desired pokemon role for you.`,
        "callback": roleController.addPokemon
    },
    "unwant": {
        "description": `${config.botName} will remove a desired pokemon role for you.`,
        "callback": roleController.removePokemon
    },
    "register": {
        "description": `${config.botName} will add a user to a users list.`,
        "callback": databaseController.addUser
    },
    "balance": {
        "alias": "bal",
        "description": `${config.botName} will fetch a user's game points balance.`,
        "callback": databaseController.getBalance
    },
    "spend": {
        "description": `${config.botName} will spend a specified amount of a user's game points for a prize.`,
        "callback": pointsController.spend
    },
    "spin": {
        "description": `${config.botName} will spin a slot machine. We are working on a point system for rewards you can earn.`,
        "callback": slotMachineController.spin
    },
    "ask": {
        "hidden": true,
        "description": `${config.botName} will ask a new qotd.`,
        "callback": qotdController.ask
    },
    "database": {
        "hidden": true,
        "description": `${config.botName} will create a database.`,
        "callback": databaseController.createDatabase
    },
    "users": {
        "hidden": true,
        "description": `${config.botName} will create a users database collection.`,
        "callback": databaseController.createUsersCollection
    },
    "add": {
        "hidden": true,
        "description": `${config.botName} will add a shiny to the shiny list.`,
        "callback": databaseController.addShiny
    },
    "remove": {
        "hidden": true,
        "description": `${config.botName} will remove a shiny from the shiny list.`,
        "callback": databaseController.removeShiny
    },
    "shinies": {
        "hidden": true,
        "description": `${config.botName} will create a shinies database collection.`,
        "callback": databaseController.createShiniesCollection
    },
    "help": {
        "hidden": true,
        "description": `${config.botName} will print commands.`,
        "callback": showCommands
    }
};

const prefixExists = ((msg) => {
    let exists = false;

    config.prefix.forEach(prefix => {
        if (msg) {
            if (msg.content.startsWith(prefix)) {
                exists = true;
            }
        }
    });
    return exists;
});

const listen = function(msg) {
    let args = msg.content.substring(1).split(" ");
    let cmd = args[0].toLowerCase();
    let commandIndex = Object.keys(commands).indexOf(cmd);
    let commandExists = commandIndex >= 0 ? true : false;
    let commandTeamIndex = config.teams.indexOf(cmd);
    let commandIsTeam = commandTeamIndex >= 0 ? true : false;

    // overwrite for alias checking
    for (let command in commands) {
        if (commands[command].hasOwnProperty("alias")) {
            if (cmd === commands[command].alias) {
                commandExists = true;
                cmd = command;
            }
        }
    }

    args = args.splice(1);

    if (commandIsTeam) commands["team"].callback(msg, new Array(config.teams[commandTeamIndex]));
    else if (commandExists) commands[cmd].callback(msg, args);
};


module.exports = {
    prefixExists,
    listen
};