const { MessageEmbed } = require('discord.js');
const MongoClient = require("mongodb").MongoClient;
const config = require("../config.json");

module.exports = {
    name: 'spend',
    description: 'Spend a specified amount of a user\'s game points for a prize',
    usage: '',
    execute(msg, args) {
        let points = args[0];
        let isNumber = /^\d+$/.test(points);

        if (isNumber) {

            MongoClient.connect(config.mongoDBURL, (err, db) => {
                if (err) throw err;
                let dbo = db.db(config.mongoDBName);
                let query = { "id": msg.member.id };
                var updatePoints = { $inc: { points: -points } };

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

            setTimeout(function() {
                MongoClient.connect(config.mongoDBURL, (err, db) => {
                    if (err) throw err;
                    let dbo = db.db(config.mongoDBName);
                    dbo.collection("users").findOne({ "id": msg.member.id }, function(err, result) {
                        if (err) throw err;

                        if (result) {
                            let balMsg = new MessageEmbed()
                                .setColor(0x007700)
                                .setTitle(`${msg.member.user.tag} You currently have ${result.points} ${config.emojies.pokecoin}`);
                            msg.channel.send(balMsg);
                        } else {
                            let regMsg = new MessageEmbed()
                                .setColor(0x007700)
                                .setTitle(`${msg.member.user.tag} You need to register to the points registry first. Please type "!register"`);

                            msg.channel.send(regMsg);
                        }

                        db.close();
                    });
                });
            }, 1000);
        } else {
            msg.channel.send(`You must specify an amount of coins as digits only, ${msg.member.user.tag}`);
        }
    },
};