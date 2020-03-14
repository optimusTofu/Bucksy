const Discord = require("discord.js");
const client = new Discord.Client();
const puppeteer = require("puppeteer");
const CronJob = require('cron').CronJob;
const auth = require("../../private/auth.json");

const scrape = (async (guilds) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.reddit.com/r/InsightfulQuestions/");
    
    let things = await page.$$(".scrollerItem");
    let questions = [];

    for (let thing of things) {
        let question = await thing.$eval(("h3"), node => node.innerText.trim());

        questions.push(question);
    };

    let question = questions[Math.floor(Math.random() * questions.length)];

    let guild = guilds.get("538597663826771968");

    let qotdMsg = new Discord.RichEmbed()
        .setColor(0x009900)
        .setTitle(`Question Of The Day`)
        .setDescription(question);

    guild.channels.get("582228584408678400").send(qotdMsg);

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
    let job = new CronJob('0 23 5 * * *', function() {
        scrape(bot.guilds);
    }, null, true, 'America/New_York');

    job.start();
};

module.exports = {
    start
};