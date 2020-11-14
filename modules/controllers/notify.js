"use strict";

const pokemon = (msg) => {
    let pokemonName = msg.embeds[0].fields[0].name.split("**")[1].toLowerCase();
    let pokemonRole = msg.guild.roles.cache.find(role => role.name.toLowerCase() === pokemonName);
    let locationName = msg.embeds[0].fields[1].name.split("|")[0];

    if (pokemonRole) {
        msg.channel.send(`${pokemonRole} - ${locationName}`);
    }
};

const alt_pokemon = (msg) => {
    let text = msg.embeds[0].title;
    let pokemonName = text.split("**")[1].toLowerCase();
    let pokemonRole = msg.guild.roles.cache.find(role => role.name.toLowerCase() === pokemonName);
    let locationName = text.split("|")[1];


    if (pokemonRole) {
        msg.channel.send(`${pokemonRole} - ${locationName}`);
    }
};

module.exports = {
    pokemon,
    alt_pokemon
};