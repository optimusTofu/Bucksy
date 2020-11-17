const { MessageEmbed } = require('discord.js');
const MongoClient = require("mongodb").MongoClient;
const config = require("../config.json");

module.exports = {
    name: 'register',
    description: 'Register for the games system to get points and play games',
    usage: '',
    execute(msg, args) {
        MongoClient.connect(config.mongoDBURL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(config.mongoDBName);
            let obj = { "id": msg.member.id, "points": config.startingPoints };
            let exists = false;

            dbo.collection("users").findOne({ "id": msg.member.id }, function(err, result) {
                if (err) throw err;
                if (result) {
                    let existMsg = new MessageEmbed()
                        .setColor(0x660000)
                        .setTitle(`${msg.member.user.tag}, you already registered. Try checking your !balance.`);
                    msg.channel.send(existMsg);
                    db.close();
                    exists = true;
                } else {
                    dbo.collection("users").insertOne(obj, (err, res) => {
                        if (err) throw err;
                        let dbMsg = new MessageEmbed()
                            .setColor(0x007700)
                            .setTitle(`${msg.member.user.tag} Welcome to the game registry!`);

                        msg.channel.send(dbMsg);
                        db.close();
                    });
                }
            });
        });
    },
};