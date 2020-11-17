const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unwant',
    description: 'Remove a desired pokemon role from your profile',
    usage: '<pokemon name>',
    args: true,
    execute(msg, args) {
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
    },
};