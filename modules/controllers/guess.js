"use strict";

const Discord = require("discord.js");
const CronJob = require('cron').CronJob;
const config = require("../../config.json");
const commands = require("./commands.js");
const databaseController = require("./database");
let answer = "";
let answered = false;
let active = false;

const pokemon_guesses = [{
        answer: "castform",
        path: "./assets/img/guesses/image0.jpg"
    },
    {
        answer: "venipede",
        path: "./assets/img/guesses/image1.jpg"
    },
    {
        answer: "noctowl",
        path: "./assets/img/guesses/image2.jpg"
    },
    {
        answer: "cobalion",
        path: "./assets/img/guesses/image3.jpg"
    },
    {
        answer: "clamperl",
        path: "./assets/img/guesses/image4.jpg"
    },
    {
        answer: "mawile",
        path: "./assets/img/guesses/image5.jpg"
    },
    {
        answer: "regigas",
        path: "./assets/img/guesses/image6.jpg"
    },
    {
        answer: "pansear",
        path: "./assets/img/guesses/image7.jpg"
    },
    {
        answer: "pichu",
        path: "./assets/img/guesses/image8.jpg"
    },
    {
        answer: "prinplup",
        path: "./assets/img/guesses/image9.jpg"
    },
    {
        answer: "palpitoad",
        path: "./assets/img/guesses/image10.jpg"
    },
    {
        answer: "pignite",
        path: "./assets/img/guesses/image11.jpg"
    },
    {
        answer: "pidove",
        path: "./assets/img/guesses/image12.jpg"
    },
    {
        answer: "palkia",
        path: "./assets/img/guesses/image13.jpg"
    },
    {
        answer: "porygon z",
        path: "./assets/img/guesses/image14.jpg"
    },
    {
        answer: "torkoal",
        path: "./assets/img/guesses/image15.jpg"
    },
    {
        answer: "corsola",
        path: "./assets/img/guesses/image16.jpg"
    },
    {
        answer: "",
        path: "./assets/img/guesses/image17.jpg"
    }
];

const sendGuess = (bot) => {
    let guessMsg = config.guessMsg;
    let guild = bot.guilds.get(config.guildID);
    let index = Math.floor(Math.random() * pokemon_guesses.length);
    let file = pokemon_guesses[index].path;
    let attachment = new Discord.Attachment(file);
    let guessEmbed = {
        title: guessMsg,
    };

    answer = pokemon_guesses[index].answer;
    answered = false;
    active = true;

    guild.channels.get(config.channels.guess).send({ files: [attachment], embed: guessEmbed });
};

const getAnswer = () => {
    return answer;
};

const getActive = () => {
    return active;
};

const getAnswered = () => {
    return answered;
};

const setAnswered = () => {
    answered = true;
};

const listen = (msg) => {
    if (msg.author.bot) return;
    if (getAnswered()) return;
    if (!getActive()) return;

    let name = msg.member.user.tag;
    let icon = msg.author.displayAvatarURL;

    if (msg.content.toLowerCase().indexOf(getAnswer().toLowerCase()) >= 0) {
        databaseController.updateBalance(msg.member.id, 100);

        let winMsg = new Discord.RichEmbed()
            .setFooter(` ${name}, You Won! 100 <:pokecoin:690199453751443476> have been added to your account.`, icon)
            .setColor(0x006600);

        msg.channel.send(winMsg);
        setAnswered();
    } else {
        databaseController.updateBalance(msg.member.id, -1);

        let loseMsg = new Discord.RichEmbed()
            .setFooter(`Sorry, ${name}. Try Again.`, icon)
            .setColor(0x660000);

        msg.channel.send(loseMsg);
    }
};

const start = (bot) => {
    let job = new CronJob(config.guessTime, function() {
        sendGuess(bot);
    }, null, true, 'America/New_York');

    job.start();
};

module.exports = {
    start,
    getAnswer,
    getAnswered,
    setAnswered,
    listen
};