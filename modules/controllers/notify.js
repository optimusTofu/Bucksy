"use strict";

const pokemon = (msg) => {
    let pokemonName = msg.embeds[0].fields[0].name.split("**")[1].toLowerCase();
    let pokemonRole = msg.guild.roles.find(role => role.name.toLowerCase() === pokemonName);
    let locationName = msg.embeds[0].fields[1].name.split("|")[0];

    if (pokemonRole) {
        msg.channel.send(`${pokemonRole} - ${locationName}`);
    }
};

module.exports = {
    pokemon
};