"use strict";

const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const logger = require("../../util/logger.js");

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
    let team = msg.guild.roles.cache.find(role => role.name === teamName);
    let user = msg.member;

    user.roles.add(msg.guild.roles.cache.find(role => role.name === "Verified"));

    if (teamName === "") return;

    if (team) {
        if (msg.member.guild.roles.cache.find(team => Object.keys(teams).includes(team.name))) removeTeam(msg)

        user.roles.add(team).catch(console.error);
    }
};

const removeTeam = function(msg) {
    let user = msg.member;

    // testing loop to remove teams from array...
    Object.keys(teams).forEach(team => {
        user.roles.cache.find(role => {
            if (team === role.name) {
                user.roles.remove(role).catch(console.error);
            }
        });
    });
};

const addLocation = function(msg, args) {
    if (typeof args[0] === "undefined") return;

    logger.debug(`Adding location role, msg: ${msg} args: ${args}`);

    let locationName = args[0].toLowerCase();
    let location = msg.guild.roles.cache.find(role => role.name === locationName);
    let user = msg.member;
    let locationMsg;

    if (locationName === "") return;

    if (location) {
        if (msg.member.roles.cache.some(role => role.name === locationName)) {
            locationMsg = new MessageEmbed()
                .setColor(0xEF2D19)
                .setTitle(`${msg.member.user.tag} You already have the **${locationName}** role.`);
        } else {
            if (Object.keys(teams).includes(locationName)) {
                removeTeam(msg);
            }

            user.roles.add(location).catch(console.error);
            locationMsg = new MessageEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You now have the **${locationName}** role.`);
        }
    } else {
        locationMsg = new MessageEmbed()
            .setColor(0xEF2D19)
            .setTitle(`${msg.member.user.tag} That role is not self-assignable.`);
    }

    msg.channel.send(locationMsg);
};

const removeLocation = function(msg, args) {
    let locationName = args[0].toLowerCase();
    let location = msg.guild.roles.cache.find(role => role.name === locationName);
    let member = msg.member;
    let locationMsg;

    if (locationName === "") return;

    if (location) {
        if (member.roles.cache.some(location => locationName === locationName)) {
            member.roles.remove(location).catch(console.error);
            locationMsg = new MessageEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${member.user.tag} You no longer have the **${locationName}** role.`);
        } else {
            locationMsg = new MessageEmbed()
                .setColor(0xEF2D19)
                .setTitle(`${member.user.tag} You do not have the **${locationName}** role assigned.`);
        }
    } else {
        locationMsg = new MessageEmbed()
            .setColor(0xEF2D19)
            .setTitle(`${member.user.tag} That role is not self-assignable.`);
    }

    msg.channel.send(locationMsg);
};

const addPokemon = function(msg, args) {
    let pokemonName = args[0].toLowerCase();
    let pokemon = msg.guild.roles.cache.find(role => role.name === pokemonName);
    let user = msg.member;
    let pokemonMsg;

    if (pokemonName === "") return;

    if (pokemon) {
        if (user.roles.cache.some(role => role.name === pokemonName)) {
            pokemonMsg = new MessageEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You already have the **${pokemonName}** role.`);

            msg.channel.send(pokemonMsg);
        } else {
            if (Object.keys(teams).includes(pokemonName)) {
                removeTeam(msg);
            }

            user.roles.add(pokemon).catch(console.error);
            pokemonMsg = new MessageEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You now have the **${pokemonName}** role.`);

            msg.channel.send(pokemonMsg);
        }
    } else {
        // Create a new role with data
        msg.guild.roles.create({
                data: {
                    name: pokemonName,
                    color: 'BLUE',
                    mentionable: true,
                }
            })
            .then(role => {
                user.roles.add(role).catch(console.error);

                pokemonMsg = new MessageEmbed()
                    .setColor(0x7FDF37)
                    .setTitle(`${msg.member.user.tag} You now have the **${pokemonName}** role.`);

                msg.channel.send(pokemonMsg);
            })
            .catch(console.error);
    }

};

const removePokemon = function(msg, args) {
    let pokemonName = args[0].toLowerCase();
    let pokemon = msg.guild.roles.cache.find(role => role.name === pokemonName);
    let user = msg.member;
    let pokemonMsg;

    if (pokemonName === "") return;

    if (pokemon) {
        if (msg.member.roles.cache.some(pokemon => pokemonName === pokemon.name)) {
            user.roles.remove(pokemon).catch(console.error);
            pokemonMsg = new MessageEmbed()
                .setColor(0x7FDF37)
                .setTitle(`${msg.member.user.tag} You no longer have the **${pokemonName}** role.`);
        } else {
            pokemonMsg = new MessageEmbed()
                .setColor(0xEF2D19)
                .setTitle(`${msg.member.user.tag} You do not have the **${pokemonName}** role assigned.`);
        }
    } else {
        pokemonMsg = new MessageEmbed()
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