const auth = require("./private/auth.json");
const config = require("./config.json");
const Discord = require("discord.js");
const apiai = require("apiai")("9ac28c4b9a0043b18b779a2ce6b8eef3");
const commands = require("./modules/controllers/commands.js");
const greeting = require("./modules/controllers/greeting.js");
const qotd = require("./modules/controllers/qotd.js");

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag} - ${bot.user.username}!`);
  qotd.start(bot);
});

bot.on('message', msg => {
    let isCommand = false;

    // ignore bots
    // if (msg.author.bot) return;

    //listen for commands by prefix(es)
    config.prefix.forEach (prefix => {
      if (msg.content.startsWith(prefix)) {
        isCommand = true;
      }
    });

    if (isCommand) {
      commands.listen(msg);
    }  else if (msg.author.bot && msg.author.username === "Hoppip" && msg.channel.name === "ultra-rare-pokemon") {
      let pokemonName = msg.embeds[0].fields[0].name.split("**")[1].toLowerCase();
      let pokemonRole = msg.guild.roles.find(role => role.name.toLowerCase() === pokemonName);
      let locationName = msg.embeds[0].fields[1].name.split("|")[0];
      
      if (pokemonRole) {  
        msg.channel.send(`${pokemonRole} - ${locationName}`);
      }
    }
/*else if (msg.content.startsWith("*")) {
      let apiaiReq = apiai.textRequest(msg.content, {
        sessionId: "bucksy"
      });

      apiaiReq.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
        msg.channel.send(aiText);
        // socket.emit('bot reply', aiText); // Send the result back to the browser!
      });

      apiaiReq.on('error', (error) => {
        console.log(error);
      });

      apiaiReq.end();
    }*/
});

bot.on('guildMemberAdd', member => {
  greeting.sayHello(member);
});

bot.on('guildMemberRemove', member => {
  greeting.sayGoodbye(member);
});

bot.login(auth.token);
