"use strict";

const auth = require("./private/auth.json");
const config = require("./config.json");
const Discord = require("discord.js");
const commands = require("./modules/controllers/commands.js");
const greeting = require("./modules/controllers/greeting.js");
const qotd = require("./modules/controllers/qotd.js");
const guess = require("./modules/controllers/guess.js");
const notify = require("./modules/controllers/notify.js");

const bot = new Discord.Client();

bot.on('ready', () => {
    qotd.start(bot);
    guess.start(bot);
    console.log(`Logged in as ${bot.user.tag} - ${bot.user.username}!`);
});

bot.on('message', msg => {
    if (commands.prefixExists(msg)) {
        commands.listen(msg);
    } else if (msg.author.bot && msg.author.username === "Hoppip" && msg.channel.name === "ultra-rare-pokemon") {
        notify.pokemon(msg);
    } else if (msg.channel.id === config.channels.guess) {
        guess.listen(msg);
    }
});

bot.on('guildMemberAdd', member => {
    greeting.sayHello(member);
});

bot.on('guildMemberRemove', member => {
    greeting.sayGoodbye(member);
});

bot.login(auth.token);