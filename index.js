const { Client, Collection } = require("discord.js");
const fs = require("fs");
const commands = fs.readdirSync("./commands");
const events = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));
const { transports, createLogger, format } = require("winston");
const dotenv = require("dotenv");
const config = require("./config.json");
const bot = new Client();

dotenv.config();

bot.config = config;
bot.commands = new Collection();
bot.cooldowns = new Collection();
bot.log = new createLogger({
  level: "debug",
  format: format.combine(format.json(), format.timestamp()),
  defaultMeta: { service: "bot-service" },
  exitOnError: false,
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/info.log", level: "info" }),
    new transports.File({ filename: "logs/debug.log", level: "debug" }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

if (process.env.NODE_ENV !== "production") {
  bot.log.add(
    new transports.Console({
      format: format.combine(format.json(), format.timestamp()),
    })
  );
}

for (const folder of commands) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    bot.commands.set(command.name, command);
  }
}

for (const file of events) {
  const event = require(`./events/${file}`);

  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args, bot));
  } else {
    bot.on(event.name, (...args) => event.execute(...args, bot));
  }
}

bot.login(process.env.TOKEN);

exports.bot = bot;
