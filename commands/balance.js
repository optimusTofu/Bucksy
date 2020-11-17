const { MessageEmbed } = require('discord.js');
const MongoClient = require("mongodb").MongoClient;
const config = require("../config.json");

module.exports = {
    name: 'balance',
    description: 'Fetch a user\'s game points balance.',
    aliases: ['bal'],
    usage: '',
    execute(msg, args) {
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
    },
};