"use strict";

const config = require("../../config.json");
const apiai = require("apiai")(config.aiID);

const listen = (msg) => {
    if (msg.author.bot) return;

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
};

module.exports = {
    listen
};