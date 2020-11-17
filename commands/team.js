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
    name: 'team',
    description: 'Set a team role for your profile',
    usage: '<team name>',
    args: true,
    execute(msg, args) {
        let teamName = args[0].toLowerCase();
        let team = msg.guild.roles.cache.find(role => role.name === teamName);
        let user = msg.member;

        user.roles.add(msg.guild.roles.cache.find(role => role.name === "Verified"));

        if (teamName === "") return;

        if (team) {
            if (msg.member.guild.roles.cache.find(team => Object.keys(teams).includes(team.name))) removeTeam(msg)

            user.roles.add(team).catch(console.error);
        }
    },
};