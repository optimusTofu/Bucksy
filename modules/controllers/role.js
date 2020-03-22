"use strict";

const Discord = require("discord.js");
const config = require("../../config.json");

const teams = {
    "instinct": {
        "symbol": config.emojies.instinct
    },
    "mystic": {
        "symbol": config.emojies.mystic
    },
    "valor": {
        "symbol": config.emojies.valor
    },
    "harmony": {
        "symbol": ""
    }
};

const addTeam = function(msg, args) {
    let teamName = args[0].toLowerCase();
    let team = msg.guild.roles.find(role => role.name === teamName);
    let user = msg.member;

    user.addRole(msg.guild.roles.find(role => role.name === "Verified"));

    if (teamName === "") return;

    if (team) {
        if (msg.member.roles.some(team => teamName === team.name)) return;
        if (msg.member.roles.some(team => Object.keys(teams).includes(team.name))) removeTeam(msg)

        user.addRole(team).catch(console.error);
    }
};

const removeTeam = function(msg) {
    let user = msg.member;

    // testing loop to remove teams from array...
    Object.keys(teams).forEach(team => {
        user.roles.find(role => {
            if (team === role.name) {
                user.removeRole(role).catch(console.error);
            }
        });
    });
};

const addLocation = function(msg, args) {
    if (typeof args[0] === "undefined") return;

    let locationName = args[0].toLowerCase();
    let location = msg.guild.roles.find(role => role.name === locationName);
    let user = msg.member;
    let locationMsg;

    if (locationName === "") return;

    if (location) {
        if (msg.member.roles.some(role => role.name === locationName)) {
            locationMsg = new Discord.RichEmbed()
                .setColor(0xEF2D19)
                .setTitle(`${msg.member.user.tag} You already have the **${location.name}** role.`);
        } else {
            if (Object.keys(teams).includes(locationName)) {
                removeTeam(msg);
            }

            user.addRole(location).catch(console.error);
            locationMsg = new Discord.RichEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You now have the **${location.name}** role.`);
        }
    } else {
        locationMsg = new Discord.RichEmbed()
            .setColor(0xEF2D19)
            .setTitle(`${msg.member.user.tag} That role is not self-assignable.`);
    }

    msg.channel.send(locationMsg);
};

const removeLocation = function(msg, args) {
    let locationName = args[0].toLowerCase();
    let location = msg.guild.roles.find(role => role.name === locationName);
    let user = msg.member;
    let locationMsg;

    if (locationName === "") return;

    if (location) {
        if (msg.member.roles.some(location => locationName === location.name)) {
            user.removeRole(location).catch(console.error);
            locationMsg = new Discord.RichEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You no longer have the **${location.name}** role.`);
        } else {
            locationMsg = new Discord.RichEmbed()
                .setColor(0xEF2D19)
                .setTitle(`${msg.member.user.tag} You do not have the **${location.name}** role assigned.`);
        }
    } else {
        locationMsg = new Discord.RichEmbed()
            .setColor(0xEF2D19)
            .setTitle(`${msg.member.user.tag} That role is not self-assignable.`);
    }

    msg.channel.send(locationMsg);
};

const addPokemon = function(msg, args) {
    let pokemonName = args[0].toLowerCase();
    let pokemon = msg.guild.roles.find(role => role.name === pokemonName);
    let user = msg.member;
    let pokemonMsg;

    if (pokemonName === "") return;

    if (pokemon) {
        if (msg.member.roles.some(role => role.name === pokemonName)) {
            pokemonMsg = new Discord.RichEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You already have the **${pokemon.name}** role.`);

            msg.channel.send(pokemonMsg);
        } else {
            if (Object.keys(teams).includes(pokemonName)) {
                removeTeam(msg);
            }

            user.addRole(pokemon).catch(console.error);
            pokemonMsg = new Discord.RichEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You now have the **${pokemon.name}** role.`);

            msg.channel.send(pokemonMsg);
        }
    } else {
        // Create a new role with data
        msg.guild.createRole({
                name: pokemonName,
                color: 'BLUE',
                mentionable: true,
            })
            .then(role => {
                user.addRole(role).catch(console.error);

                pokemonMsg = new Discord.RichEmbed()
                    .setColor(0x7FDF37)
                    .setTitle(`${msg.member.user.tag} You now have the **${role.name}** role.`);

                msg.channel.send(pokemonMsg);
            })
            .catch(console.error);
    }

};

const removePokemon = function(msg, args) {
    let pokemonName = args[0].toLowerCase();
    let pokemon = msg.guild.roles.find(role => role.name === pokemonName);
    let user = msg.member;
    let pokemonMsg;

    if (pokemonName === "") return;

    if (pokemon) {
        if (msg.member.roles.some(pokemon => pokemonName === pokemon.name)) {
            user.removeRole(pokemon).catch(console.error);
            pokemonMsg = new Discord.RichEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You no longer have the **${pokemon.name}** role.`);
        } else {
            pokemonMsg = new Discord.RichEmbed()
                .setColor(0xEF2D19)
                .setTitle(`${msg.member.user.tag} You do not have the **${pokemon.name}** role assigned.`);
        }
    } else {
        pokemonMsg = new Discord.RichEmbed()
            .setColor(0xEF2D19)
            .setTitle(`${msg.member.user.tag} That role is not self-assignable.`);
    }

    msg.channel.send(pokemonMsg);
};

module.exports = {
    addTeam,
    addLocation,
    addPokemon,
    removeTeam,
    removeLocation,
    removePokemon
};