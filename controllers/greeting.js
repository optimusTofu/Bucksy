const config = require("../config.json");

const hellos = [
    "Hey there, ",
    "Sup, ",
    "Hi, ",
    "Jeez... I thought you were ignoring me, "
];

const goodbyes = [
    "See ya later, "
];

const greetings = [
    "Sup wit it, ",
    "Oh snap <name> is in the house",
    "Attention please <name> has entered the building"
];

const getHelloMsg = function() {
    let helloMsg = hellos[Math.floor(Math.random() * hellos.length)];

    return helloMsg;
};

const getGoodbyeMsg = function() {
    let goodbyeMsg = goodbyes[Math.floor(Math.random() * goodbyes.length)];

    return goodbyeMsg;
};

const getGreetingMsg = function() {
    let greetingMsg = greetings[Math.floor(Math.random() * greetings.length)];

    return greetingMsg;
};

const sayHello = function(member) {
    let helloMsg = getHelloMsg();
    const guild = member.guild;
    guild.channels.cache.find(channel => channel.name === "pokenavigate-yourself").send(`
    Hey ${member.user} welcome to the server! Assign your team here and the rest of the server/channels will open up for you! We are happy to have you! ☺️`)
        .then(function(msg) {
            msg.react(config.teams.valor.symbol)
                .then(() => {
                    msg.react(config.teams.instinct.symbol)
                })
                .then(() => {
                    msg.react(config.teams.mystic.symbol)
                })
                .then(() => {
                    const filter = (reaction, user) => {
                        return ['valor', 'instinct', 'mystic'].includes(reaction.emoji.name) && user.id === member.user.id;
                    };

                    msg.awaitReactions(filter, { max: 1 })
                        .then(collected => {
                            const reaction = collected.first();
                            let verified = guild.roles.cache.find(role => role.name === "Verified");
                            if (reaction.emoji.name === 'valor') {
                                let valor = guild.roles.cache.find(role => role.name === "valor");
                                member.roles.add(valor).catch(console.error);
                                member.roles.add(verified).catch(console.error);
                                msg.channel.send(`${member.user.tag}, you now have the valor role`);
                            } else if (reaction.emoji.name === 'instinct') {
                                let instinct = guild.roles.cache.find(role => role.name === "instinct");
                                member.roles.add(instinct).catch(console.error);
                                member.roles.add(verified).catch(console.error);
                                msg.channel.send(`${member.user.tag}, you now have the instinct role`);
                            } else if (reaction.emoji.name === 'mystic') {
                                let mystic = guild.roles.cache.find(role => role.name === "mystic");
                                member.roles.add(mystic).catch(console.error);
                                member.roles.add(verified).catch(console.error);
                                msg.channel.send(`${member.user.tag}, you now have the mystic role`);
                            } else {
                                msg.channel.send(`${member.user.tag}, you reacted with something else entirely.`);
                            }
                        });
                });


        }).catch(function(e) {
            console.error("Something went wrong.", e);
        });
};

const sayGoodbye = function(member) {
    const guild = member.guild;
    guild.channels.cache.find(channel => channel.name === "felicia").send(`User, ${member.user.tag}, has left the building.`)
        .then(function(msg) {
            msg.react("👎")
        }).catch(function() {
            console.error("Something went wrong.");
        });
};

module.exports = {
    sayHello,
    sayGoodbye
};