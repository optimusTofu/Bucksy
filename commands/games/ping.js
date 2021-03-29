module.exports = {
  name: "hello",
  description: "pong",
  aliases: ["hello"],
  guildOnly: true,
  usage: "",
  execute(msg) {
    msg.channel.send("Hello!!");
  },
};
