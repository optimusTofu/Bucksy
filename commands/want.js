const { MessageEmbed } = require('discord.js');
const { teams } = require('../config.json');

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

module.exports = {
    name: 'want',
    description: 'Set a desired pokemon role for your profile',
    usage: '<pokemon name>',
    args: true,
    execute(msg, args) {
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
    },
};