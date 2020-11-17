const { MessageEmbed } = require('discord.js');
const { teams } = require('../config.json');

module.exports = {
    name: 'iamnot',
    description: 'Remove a role for your location(s)',
    aliases: ['iamn'],
    usage: '<location>',
    args: true,
    execute(msg, args) {
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
    },
};