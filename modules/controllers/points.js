"use strict";

const logger = require("../../util/logger.js");
const databaseController = require("./database.js");

const spend = function(msg, args) {
    console.log(args);

    if (!args.length) {
        msg.channel.send(`You must specify an amount of coins to spend, ${msg.member.user.tag}`);
    } else {
        let points = args[0];
        let isNumber = /^\d+$/.test(points);

        if (isNumber) {

            databaseController.updateBalance(msg, msg.member.id, -points);
            setTimeout(function() {
                databaseController.getBalance(msg);
            }, 1000);
        } else {
            msg.channel.send(`You must specify an amount of coins as digits only, ${msg.member.user.tag}`);
        }
    }
};

module.exports = {
    spend
};