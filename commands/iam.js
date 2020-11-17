const { MessageEmbed } = require('discord.js');
const { teams } = require('../config.json');

module.exports = {
    name: 'iam',
    description: 'Set a role for your location(s)',
    aliases: ['location'],
    usage: '<location>',
    args: true,
    execute(msg, args) {
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
    },
};