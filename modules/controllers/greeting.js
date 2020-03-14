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

const getHelloMsg = function () {
    let helloMsg = hellos[Math.floor(Math.random() * hellos.length)];

    return helloMsg;
};

const getGoodbyeMsg = function () {
    let goodbyeMsg = goodbyes[Math.floor(Math.random() * goodbyes.length)];

    return goodbyeMsg;
};

const getGreetingMsg = function () {
    let greetingMsg = greetings[Math.floor(Math.random() * greetings.length)];

    return greetingMsg;
};

const sayHello = function (member) {
    let helloMsg = getHelloMsg();
    const guild = member.guild;
    guild.channels.find(channel => channel.name === "pokenavigate-yourself").send(`
    Hey ${member.user} welcome to the server! Assign your team here and the rest of the server/channels will open up for you! We are happy to have you! ☺️`)
        .then(function (message) {
            message.react("542521772059131905").then(() => {
                message.react("542521976351227916")
            }).then(() => {
                message.react("542521820318793728")
            });

            const filter = (reaction, user) => {
                return ['valor', 'instinct', 'mystic'].includes(reaction.emoji.name) && user.id === member.user.id;
            };
            
            message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name === 'valor') {
                        let valor = guild.roles.find(role => role.name === "valor");
                        member.addRole(valor).catch(console.error);
                        message.channel.send(`${member.user.tag}, you now have the valor role`);
                    } else if (reaction.emoji.name === 'instinct') {
                        let instinct = guild.roles.find(role => role.name === "instinct");
                        member.addRole(instinct).catch(console.error);
                        message.channel.send(`${member.user.tag}, you now have the instinct role`);
                    } else if (reaction.emoji.name === 'mystic') {
                        let mystic = guild.roles.find(role => role.name === "mystic");
                        member.addRole(mystic).catch(console.error);
                        message.channel.send(`${member.user.tag}, you now have the mystic role`);
                    } else {
                        message.channel.send(`${member.user.tag}, you reacted with something else entirely.`);
                    }
                })
                .catch(collected => {
                    message.channel.send(`Yoo-hoo ${member.user.tag}, you didn’t set your team yet. Please do so, we want you to join in on the fun! To set your team simply type $team name and replace “name” with the name of your team!`);
                });
            
        }).catch(function(e) {
            console.error("Something went wrong.", e);
        });
};

const sayGoodbye = function (member) {
    const guild = member.guild;
    guild.channels.find(channel => channel.name === "felicia").send(`User, ${member.user.tag}, has left the building.`)
        .then(function (message) {
            message.react("👎")
        }).catch(function() {
            console.error("Something went wrong.");
        });
};

module.exports = {
    sayHello,
    sayGoodbye
};
