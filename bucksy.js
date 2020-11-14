"use strict";

const auth = require("./private/auth.json");
const config = require("./config.json");
const { Client } = require("discord.js");
const commands = require("./modules/controllers/commands.js");
const greeting = require("./modules/controllers/greeting.js");
const qotd = require("./modules/controllers/qotd.js");
const guess = require("./modules/controllers/guess.js");
const notify = require("./modules/controllers/notify.js");
const ai = require("./modules/controllers/ai.js");
// const ocr = require("./modules/controllers/ocr.js");
const logger = require("./util/logger.js");

const bot = new Client();

bot.on('ready', () => {
    // qotd.start(bot);
    // guess.start(bot);
    logger.info(`Logged in as ${bot.user.tag} - ${bot.user.username}!`);
});

bot.on('message', msg => {
    if (commands.prefixExists(msg)) {
        logger.info(`Command Found, Listening to ${msg}`);
        commands.listen(msg);
    } else if (msg.author.bot && msg.author.username === "Hoppip" && msg.channel.name === "ultra-rare-pokemon") {
        logger.info(`Notifying subscribed users of rare pokemon from Hoppip: ${msg}`);
        notify.pokemon(msg);
    } else if (msg.author.bot && msg.author.username === "Klefki" && msg.channel.name === "ultra-rare-pokemon") {
        notify.alt_pokemon(msg);
        logger.info(`Notifying subscribed users of rare pokemon from Klefki: ${msg}`);
    } else if (msg.channel.id === config.channels.guess) {
        guess.listen(msg);
        logger.info(`Listening to guess response: ${msg}`);
    } else if (msg.channel.id === config.channels.ai) {
        ai.listen(msg);
        logger.info(`AI Feedback: ${msg}`);
    }
    /* else if (msg.channel.id === config.channels.count) {
            if (msg.attachments.size > 0 && msg.attachments.every(ocr.isImage)) {
                ocr.readPokemonCountImageText(msg, msg.attachments.array()[0]);
            }
        }*/
});

bot.on('guildMemberAdd', member => {
    greeting.sayHello(member);
    logger.info(`Sending a warm greeting to new user: ${member}`);
});

bot.on('guildMemberRemove', member => {
    greeting.sayGoodbye(member);
    logger.info(`Saying goodbye to user: ${member}`);
});

bot.login(auth.token);