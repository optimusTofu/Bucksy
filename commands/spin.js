const { MessageEmbed } = require('discord.js');
const MongoClient = require("mongodb").MongoClient;
const config = require("../config.json");

const emojies = [
    config.emojies.nanab,
    config.emojies.nanab,
    config.emojies.nanab,
    config.emojies.nanab,
    config.emojies.nanab,
    config.emojies.pinap,
    config.emojies.pinap,
    config.emojies.pinap,
    config.emojies.pinap,
    config.emojies.razz,
    config.emojies.razz,
    config.emojies.razz,
    config.emojies.silver_pinap,
    config.emojies.silver_pinap,
    config.emojies.golden_razz
];

const generateRandomEmoji = function(max) {
    return emojies[Math.floor(Math.random() * max)];
};

module.exports = {
    name: 'spin',
    description: 'Spin a slot machine for rewards',
    usage: '',
    execute(msg, args) {
        if (msg.channel.id !== config.channels.slots) return;

        MongoClient.connect(config.mongoDBURL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(config.mongoDBName);
            let query = { "id": msg.member.id };
            var updatePoints = { $inc: { points: -1 } };

            dbo.collection("users").findOne({ "id": msg.member.id }, function(err, result) {
                if (err) throw err;

                if (result) {
                    dbo.collection("users").updateOne(query, updatePoints, function(err, res) {
                        if (err) throw err;
                        db.close();
                    });
                } else {
                    let dbMsg = new MessageEmbed()
                        .setColor(0x770000)
                        .setTitle(`${msg.member.user.tag} You need to register to the points registry first. Please type "!register"`);

                    msg.channel.send(dbMsg);
                }
            });
        });

        let first = generateRandomEmoji(emojies.length);
        let second = generateRandomEmoji(emojies.length);
        let third = generateRandomEmoji(emojies.length);

        let result = first + second + third;
        let win = (first === second && second === third) ? true : false;
        let name = msg.author.displayName;
        let icon = msg.author.displayAvatarURL;

        let slotMsg = new MessageEmbed()
            .setFooter("Try again.", icon)
            .addField("Slot Machine Results", result, true)
            .setColor(0xFFA500);

        if (win) {
            let winMsg;
            let score;

            switch (first) {
                case emojies[0]:
                    score = 50;
                    winMsg = new MessageEmbed()
                        .setFooter("You Won! 50 PokeCoins have been added to your account.", icon)
                        .addField(`Slot Machine Results ${emojies.pokecoin}`, result, true)
                        .setColor(0x006600);
                    break;
                case emojies[5]:
                    score = 100;
                    winMsg = new MessageEmbed()
                        .setFooter("You Won! 100 PokeCoins have been added to your account.", icon)
                        .addField(`Slot Machine Results ${emojies.pokecoin}`, result, true)
                        .setColor(0x006600);
                    break;
                case emojies[9]:
                    score = 500;
                    winMsg = new MessageEmbed()
                        .setFooter("You Won! 500 PokeCoins have been added to your account.", icon)
                        .addField(`Slot Machine Results ${emojies.pokecoin}`, result, true)
                        .setColor(0x006600);
                    break;
                case emojies[12]:
                    score = 1000;
                    winMsg = new MessageEmbed()
                        .setFooter("You Won! 1000 PokeCoins have been added to your account.", icon)
                        .addField(`Slot Machine Results ${emojies.pokecoin}`, result, true)
                        .setColor(0x006600);
                    break;
                case emojies[14]:
                    score = 5000;
                    winMsg = new MessageEmbed()
                        .setFooter("You Won! 5000 PokeCoins have been added to your account.", icon)
                        .addField(`Slot Machine Results ${emojies.pokecoin}`, result, true)
                        .setColor(0x006600);
                    break;
            };

            MongoClient.connect(config.mongoDBURL, (err, db) => {
                if (err) throw err;
                let dbo = db.db(config.mongoDBName);
                let query = { "id": msg.member.id };
                var updatePoints = { $inc: { points: score } };

                dbo.collection("users").findOne({ "id": msg.member.id }, function(err, result) {
                    if (err) throw err;

                    if (result) {
                        dbo.collection("users").updateOne(query, updatePoints, function(err, res) {
                            if (err) throw err;
                            db.close();
                        });
                    } else {
                        let dbMsg = new MessageEmbed()
                            .setColor(0x770000)
                            .setTitle(`${msg.member.user.tag} You need to register to the points registry first. Please type "!register"`);

                        msg.channel.send(dbMsg);
                    }
                });
            });

            msg.channel.send(winMsg);
        } else {
            msg.channel.send(slotMsg);
        }
    },
};