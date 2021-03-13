module.exports = {
    pokemon: (msg) => {
        let text = msg.embeds[0].description;
        let pokemonName = text.split(" ")[0].toLowerCase();
        let pokemonRole = msg.guild.roles.cache.find(role => pokemonName.startsWith(role.name.toLowerCase()));
        let locationName = msg.embeds[0].title;

        if (pokemonRole) {
            msg.channel.send(`${pokemonRole} - ${locationName}`);
        }
    }
}