const { MessageEmbed } = require("discord.js");
const { teams } = require("../../config.json");
const { removeTeam } = require("../../util/removeTeam.js");

module.exports = {
  name: "iam",
  description: "Set a role for your user profile.",
  aliases: ["location", "team", "role"],
  usage: "<role>",
  guildOnly: true,
  args: true,
  execute(msg, args) {
    const roleName = args[0].toLowerCase();
    const existingRole = msg.guild.roles.cache.find(
      (role) => role.name === roleName
    );
    const user = msg.member;
    let roleMsg;

    if (roleName === "") return;

    if (existingRole) {
      if (msg.member.roles.cache.some((role) => role.name === roleName)) {
        roleMsg = new MessageEmbed()
          .setColor(0xef2d19)
          .setTitle(
            `${msg.member.user.tag} You already have the **${roleName}** role.`
          );
      } else {
        if (Object.keys(teams).includes(roleName)) {
          removeTeam(msg);
        }

        user.roles.add(existingRole).catch(console.error);
        roleMsg = new MessageEmbed()
          .setColor(0x7fdf37)
          .setTitle(
            `${msg.member.user.tag} You now have the **${roleName}** role.`
          );
      }
    } else {
      roleMsg = new MessageEmbed()
        .setColor(0xef2d19)
        .setTitle(`${msg.member.user.tag} That role is not self-assignable.`);
    }

    msg.channel.send(roleMsg);
  },
};
