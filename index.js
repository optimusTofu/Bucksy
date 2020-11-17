const fs = require('fs');
const { Client, Collection } = require('discord.js');
const { token } = require('./private/auth.json');
const config = require('./config.json');
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const qotdController = require("./controllers/qotd.js");
const greetingController = require("./controllers/greeting.js");
const notify = require("./controllers/notify.js");
const ai = require("./controllers/ai.js");
const qotd = require('./controllers/qotd.js');

const bot = new Client();
bot.commands = new Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

const cooldowns = new Collection();

const prefixExists = ((msg) => {
    let exists = false;

    config.prefix.forEach(prefix => {
        if (msg) {
            if (msg.content.startsWith(prefix)) {
                exists = true;
            }
        }
    });

    return exists;
});

bot.once('ready', () => {
    qotdController.start(bot);
    console.log(`Logged in as ${bot.user.tag} - ${bot.user.username}!`)
});

bot.on('message', (msg) => {
    const args = msg.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (prefixExists(msg)) {
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && msg.channel.type === 'dm') {
            return msg.reply('I can\'t execute that command inside DMs!');
        }

        if (commands.modOnly && !msg.member.roles.cache.some(r => config.modRoles.includes(r.name))) {
            return msg.reply('I can\'t execute that command for you, ask a moderator for help.');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${msg.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`!${command.name} ${command.usage}\``;
            }

            return msg.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(msg.author.id)) {
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

        try {
            command.execute(msg, args);
        } catch (error) {
            console.error(error);
            msg.reply('Oops! I am having trouble executing that command.');
        }
    } else if (msg.author.bot && msg.author.username === config.hoppip.name && msg.channel.name === "ultra-rare-pokemon") {
        notify.pokemon(msg);
    } else if (msg.channel.id === config.channels.ai) {
        ai.listen(msg);
    }
});

bot.on('guildMemberAdd', (member) => {
    console.info(`Sending a warm greeting to new user: ${member}`);
    greetingController.sayHello(member);
});

bot.on('guildMemberRemove', (member) => {
    console.info(`Saying goodbye to user: ${member}`);
    greetingController.sayGoodbye(member);
});

bot.login(token);