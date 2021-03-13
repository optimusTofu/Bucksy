module.exports = {
    pokemon: (msg) => {
        let text = msg.embeds[0].description;
        let pokemonName = text.split(" ")[0].toLowerCase();
        let pokemonRole = msg.guild.roles.cache.find(role => pokemonName.startsWith(role.name.toLowerCase()));
        let locationName = msg.embeds[0].title.toLowerCase;
        let locationRole = msg.guild.roles.cache.find(role => locationName.startsWith(role.name.toLowerCase()));

        if (pokemonRole) {
            msg.channel.send(`A wild ${pokemonRole} appeared in ${locationRole}`);
        }
    }
}