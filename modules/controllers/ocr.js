"use strict";

const https = require("https");
const fs = require("fs");
const tesseract = require("node-tesseract-ocr");
const logger = require("../../util/logger.js");
const path = require("path");
const removeDiacritics = require("diacritics").remove;
var Clipper = require('image-clipper');
var Jimp = require('jimp');

const isImage = function(attachment) {
    // return true for image attachments
    let imgURL = attachment.url;
    let extensions = [".jpg", ".jpeg", ".png"];
    let extension = imgURL.substring(imgURL.lastIndexOf("."), imgURL.length);

    return extensions.indexOf(extension) >= 0;
};

const readLevel40ImageText = (msg, attachment) => {
    msg.react("🤔")
        .catch(logger.error)
        .then(logger.info("Scanning image..."));

    const file = fs.createWriteStream(path.resolve("./assets/img/temp/lvl40", "image.png"));
    const request = https.get(attachment.url, function(response) {
        response.pipe(file);
        response.on("end", function() {
            // let image = path.resolve(file.path);
            let output = path.resolve("./assets/img/temp/lvl40", "output.png");

            sharp(file.path)
                // .resize({
                //     width: 1080,
                //     height: 1920
                // })
                .extract({
                    width: 350,
                    height: 500,
                    left: 0,
                    top: 1100
                }).toBuffer()
                .then(function(data) {
                    logger.info("Image cropped and saved", data);
                    tesseract.recognize(data).then(text => {
                        msg.clearReactions();
                        let levelTxt = text.substring(0, 2);
                        let isLevel40 = levelTxt === "40" ? true : false;
                        let outputMsg = "";
                        if (isLevel40) {
                            outputMsg = `Congratulations! ${msg.author} You are now in the level 40 club.`;
                        } else {
                            outputMsg = `It appears you have some work to do still, ${msg.author}. You're level is only ${levelTxt}`;
                        }

                        msg.channel.send(outputMsg);
                        msg.react("✅")
                            .catch(logger.error)
                            .then(logger.info("Scanned image successfully!"));
                    }).catch(err => {
                        msg.clearReactions();
                        msg.react("😵")
                            .catch(logger.error)
                            .then(logger.info("Scanned image successfully!"));
                        logger.error('error:', err);
                    });
                })
                .catch(function(err) {
                    logger.error("An error occured", err);
                });
        });
    });
};

const readPokemonCountImageText = (msg, attachment) => {
    msg.react("🤔")
        .catch(logger.error)
        .then(logger.info("Scanning image..."));

    const file = fs.createWriteStream(path.resolve("./assets/img/temp/countChallenge", "pokemonCount.jpg"));
    const request = https.get(attachment.url, function(response) {
        response.pipe(file);
        response.on("end", function() {
            console.log(file.path);
            Clipper.configure({
                canvas: require('canvas')
            });

            Clipper(file.path, function() {
                this.crop(370, 100, 300, 150)
                    .quality(100)
                    .toFile(path.resolve("./assets/img/temp/countChallenge/", "output.jpg"), function() {
                        console.log('saved!');
                    });
            });

            Jimp.read(path.resolve("./assets/img/temp/countChallenge/", "output.jpg"), (err, lenna) => {
                if (err) throw err;
                lenna
                    .greyscale() // set greyscale
                    .write(path.resolve("./assets/img/temp/countChallenge/", "out-bw.jpg")); // save
            });

            tesseract.recognize(path.resolve("./assets/img/temp/countChallenge/", "out-bw.jpg")).then(text => {
                msg.clearReactions();

                console.log(text);

                let cp = text.match(/\d+/g).map(Number)[0];

                msg.react("✅")
                    .catch(logger.error)
                    .then(logger.info("Scanned image successfully!"));

                msg.channel.send(cp);
            }).catch(err => {
                msg.clearReactions();
                msg.react("😵")
                    .catch(logger.error)
                    .then(logger.info("Scanned image successfully!"));
                logger.error('error:', err);
            });
        });
    });
};

module.exports = {
    isImage,
    readLevel40ImageText,
    readPokemonCountImageText
};