"use strict";

const config = require("../../config.json");
const Discord = require("discord.js");
const mongo = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const logger = require("../../util/logger.js");

const createDatabase = function() {
    let mongoURL = config.mongoDBURL + config.mongoDBName;

    MongoClient.connect(mongoURL, (err, db) => {
        if (err) throw err;
        logger.info("Database created!");
        db.close();
    });
};

const createUsersCollection = function() {
    MongoClient.connect(config.mongoDBURL, (err, db) => {
        if (err) throw err;
        let dbo = db.db(config.mongoDBName);
        dbo.createCollection("users", (err, res) => {
            if (err) throw err;
            logger.info("Collection created!");
            db.close();
        });
    });
};

const addUser = function(msg, args) {
    MongoClient.connect(config.mongoDBURL, (err, db) => {
        if (err) throw err;
        let dbo = db.db(config.mongoDBName);
        let obj = { "id": msg.member.id, "points": config.startingPoints };
        let exists = false;

        dbo.collection("users").findOne({ "id": msg.member.id }, function(err, result) {
            if (err) throw err;
            if (result) {
                let existMsg = new Discord.RichEmbed()
                    .setColor(0x660000)
                    .setTitle(`${msg.member.user.tag}, you already registered. Try checking your !balance.`);
                msg.channel.send(existMsg);
                db.close();
                exists = true;
            } else {
                dbo.collection("users").insertOne(obj, (err, res) => {
                    if (err) throw err;
                    let dbMsg = new Discord.RichEmbed()
                        .setColor(0x007700)
                        .setTitle(`${msg.member.user.tag} Welcome to the game registry!`);

                    msg.channel.send(dbMsg);
                    db.close();
                });
            }
        });
    });
};

const getBalance = function(msg, args) {
    MongoClient.connect(config.mongoDBURL, (err, db) => {
        if (err) throw err;
        let dbo = db.db(config.mongoDBName);
        dbo.collection("users").findOne({ "id": msg.member.id }, function(err, result) {
            if (err) throw err;

            if (result) {
                let balMsg = new Discord.RichEmbed()
                    .setColor(0x007700)
                    .setTitle(`${msg.member.user.tag} You currently have ${result.points} ${config.emojies.pokecoin}`);
                msg.channel.send(balMsg);
            } else {
                let regMsg = new Discord.RichEmbed()
                    .setColor(0x007700)
                    .setTitle(`${msg.member.user.tag} You need to register to the points registry first. Please type "!register"`);

                msg.channel.send(regMsg);
            }

            db.close();
        });
    });
};

const updateBalance = function(msg, uid, score) {
    MongoClient.connect(config.mongoDBURL, (err, db) => {
        if (err) throw err;
        let dbo = db.db(config.mongoDBName);
        let query = { "id": uid };
        var updatePoints = { $inc: { points: score } };

        dbo.collection("users").findOne({ "id": uid }, function(err, result) {
            if (err) throw err;

            if (result) {
                dbo.collection("users").updateOne(query, updatePoints, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
            } else {
                let dbMsg = new Discord.RichEmbed()
                    .setColor(0x770000)
                    .setTitle(`${msg.member.user.tag} You need to register to the points registry first. Please type "!register"`);

                msg.channel.send(dbMsg);
            }
        });
    });
};

module.exports = {
    createDatabase,
    createUsersCollection,
    addUser,
    getBalance,
    updateBalance
};