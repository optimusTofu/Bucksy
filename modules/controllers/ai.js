"use strict";

const config = require("../../config.json");
const apiai = require("apiai")(config.aiID);
const logger = require("../../util/logger.js");

const listen = (msg) => {
    if (msg.author.bot) return;

    let apiaiReq = apiai.textRequest(msg.content, {
        sessionId: "bucksy"
    });
    apiaiReq.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
        msg.channel.send(aiText);
    });

    apiaiReq.on('error', (error) => {
        logger.error(error);
    });

    apiaiReq.end();
};

module.exports = {
    listen
};