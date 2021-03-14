module.exports = {
    pokemon: (msg) => {
        // console.log(msg.embeds[0]);
        let embed = msg.embeds[0];

        if (embed) {
            let text = embed.description;
            let pokemonName = text.split(" ")[0].toLowerCase();
            let pokemonRole = msg.guild.roles.cache.find(role => pokemonName.startsWith(role.name.toLowerCase()));
            let locationName = embed.title.toLowerCase();
            let locationRole = msg.guild.roles.cache.find(role => locationName.startsWith(role.name.toLowerCase()));

            console.log(pokemonName);
            console.log(pokemonRole);

            console.log(locationName);
            console.log(locationRole);

            if (pokemonRole) {
                msg.channel.send(`A wild ${pokemonRole} appeared in ${locationRole}`);
            }
        }
    }
}