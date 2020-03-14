const config = require("../../config.json");
const roleController = require("./role.js");

const commands = {
    "iam": {
        "aliases": ["iam", "l"],
        "description": `${config.botName} will assign a location role for you.`,
        "callback": roleController.addLocation
    },
    "iamnot": {
        "aliases": ["iamnot", "n"],
        "description": `${config.botName} will remove a location role for you.`,
        "callback": roleController.removeLocation
    },
    "team": {
        "aliases": ["team", "t"],
        "description": `${config.botName} will assign a team role for you.`,
        "callback": roleController.addTeam
    },
    "want": {
        "aliases": ["want", "w"],
        "description": `${config.botName} will assign a desired pokemon role for you.`,
        "callback": roleController.addPokemon
    },
    "unwant": {
        "aliases": ["unwant", "u"],
        "description": `${config.botName} will remove a desired pokemon role for you.`,
        "callback": roleController.removePokemon
    }
};

const listen = function (msg) {
    let args = msg.content.substring(1).split(" ");
    let cmd = args[0].toLowerCase();
    let commandIndex = Object.keys(commands).indexOf(cmd); 
    let commandExists = commandIndex >= 0 ? true : false;
    let commandTeamIndex = config.teams.indexOf(cmd);
    let commandIsTeam = commandTeamIndex >= 0 ? true : false;
    
    args = args.splice(1);

    if (commandIsTeam) commands["team"].callback(msg, new Array(config.teams[commandTeamIndex]));
    else if (commandExists) commands[cmd].callback(msg, args);
};

module.exports = {
    commands,
    listen
};