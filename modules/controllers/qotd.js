const Discord = require("discord.js");
const client = new Discord.Client();
const puppeteer = require("puppeteer");
const CronJob = require('cron').CronJob;
const auth = require("../../private/auth.json");
const config = require("../../config.json");
const curseWordList = require("../../private/curseWordList.json");

const sanitize = (input) => {
    let words = input.split(" ");

    let filtered = words.map(word => {
        if (curseWordList.indexOf(word) >= 0) {
            return word.replace(/./g, "*");
        }

        return word;
    });

    return filtered.join(" ");
};

const scrape = (async (guilds) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    const page = await browser.newPage();
    await page.goto("https://www.reddit.com/r/AskReddit/");
    
    let things = await page.$$(".scrollerItem");
    let questions = [];

    for (let thing of things) {
        let question = await thing.$eval(("h3"), node => node.innerText.trim());

        questions.push(question);
    };

    let question = sanitize(questions[Math.floor(Math.random() * questions.length)]);

    let guild = guilds.get(config.guildID);

    let qotdMsg = new Discord.RichEmbed()
        .setColor(0x009900)
        .setTitle(`Question Of The Day`)
        .setDescription(question);

    guild.channels.get(config.channels.qotd).send(qotdMsg);

    await browser.close();
});

// CRON Ranges
/*
    Seconds: 0-59
    Minutes: 0-59
    Hours: 0-23
    Day of Month: 1-31
    Months: 0-11 (Jan-Dec)
    Day of Week: 0-6 (Sun-Sat)
*/
const start = (bot) => {
    let job = new CronJob(config.qotdTime, function() {
        scrape(bot.guilds);
    }, null, true, 'America/New_York');

    job.start();
};

module.exports = {
    start
};