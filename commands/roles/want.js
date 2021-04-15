const { MessageEmbed } = require("discord.js");
const { teams } = require("../../config.json");
const { removeTeam } = require("../../util/removeTeam.js");

module.exports = {
  name: "want",
  description: "Set a desired pokemon for your profile.",
  usage: "<pokemon_name>",
  guildOnly: true,
  args: true,
  execute(msg, args) {

    const pokemonName = args[0].toLowerCase();
    const pokemon = msg.guild.roles.cache.find(
      (role) => role.name === pokemonName
    );
    const user = msg.member;
    let pokemonMsg;

    if (pokemonName === "") return;

    if (pokemon) {
      if (user.roles.cache.some((role) => role.name === pokemonName)) {
        pokemonMsg = new MessageEmbed()
          .setColor(0x7fdf37)
          .setTitle(
            `${msg.member.user.tag} You already have the **${pokemonName}** role.`
          );

        msg.channel.send(pokemonMsg);
      } else {
        // if (Object.keys(teams).includes(pokemonName)) {
        //   removeTeam(msg);
        // }

        user.roles.add(pokemon).catch(console.error);
        pokemonMsg = new MessageEmbed()
          .setColor(0x7fdf37)
          .setTitle(
            `${msg.member.user.tag} You now have the **${pokemonName}** role.`
          );

        msg.channel.send(pokemonMsg);
      }
    } else {

      // Create a new role with data
      msg.guild.roles
        .create({
          data: {
            name: pokemonName,
            color: "BLUE",
            mentionable: true,
          },
        })
        .then((role) => {
          user.roles.add(role).catch(console.error);

          pokemonMsg = new MessageEmbed()
            .setColor(0x7fdf37)
            .setTitle(
              `${msg.member.user.tag} You now have the **${pokemonName}** role.`
            );

          msg.channel.send(pokemonMsg);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
};
