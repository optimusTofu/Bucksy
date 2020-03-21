"use strict";

const config = require("../../config.json");
const roleController = require("./role.js");
const databaseController = require("./database.js");
const slotMachineController = require("./slots.js");
const helpController = require("./help.js");

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
    "spin": {
        "description": `${config.botName} will spin a slot machine. We are working on a point system for rewards you can earn.`,
        "callback": slotMachineController.spin
    },
    "database": {
        "description": `${config.botName} will create a database.`,
        "callback": databaseController.createDatabase
    },
    "collection": {
        "description": `${config.botName} will create a users collection.`,
        "callback": databaseController.createUsersCollection
    },
    "help": {
        "description": `${config.botName} will print commands.`,
        "callback": helpController.showCommands.bind(this)
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

const getCommands = function() {
    return commands;
};

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
    getCommands,
    listen
};