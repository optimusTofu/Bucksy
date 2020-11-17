module.exports = {
    pokemon: (msg) => {
        let text = msg.embeds[0].title;
        let pokemonName = text.split("**")[1].toLowerCase();
        let pokemonRole = msg.guild.roles.cache.find(role => role.name.toLowerCase() === pokemonName);
        let locationName = text.split("|")[1];

        if (pokemonRole) {
            msg.channel.send(`${pokemonRole} - ${locationName}`);
        }
    }
}