const { MessageEmbed } = require("discord.js");
const puppeteer = require("puppeteer");
const CronJob = require('cron').CronJob;
const config = require("../config.json");
const Filter = require("bad-words");

const filter = new Filter();

const scrape = (async(guilds) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        const page = await browser.newPage();
        await page.goto(config.qotdURL);

        let things = await page.$$(".scrollerItem:not(.Blank)");
        let questions = [];

        for (let thing of things) {
            let question = await thing.$eval(("h3"), node => node.innerText.trim());

            questions.push(question);
        };

        let question = filter.clean(questions[Math.floor(Math.random() * questions.length)]);

        let guild = guilds.cache.get(config.guildID);

        let qotdMsg = new MessageEmbed()
            .setColor(0x009900)
            .setTitle(`Question Of The Day`)
            .setDescription(question);

        guild.channels.cache.get(config.channels.qotd).send(qotdMsg);

        await browser.close();
    } catch (err) {
        console.error(err);
    }
});

const ask = (async(msg) => {
    if (msg.channel.id === config.channels.qotd && msg.member.roles.cache.some(r => config.modRoles.includes(r.name))) {
        msg.react("🤔")
            .catch(console.error)
            .then(console.info("Fetching new QOTD..."));
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        const page = await browser.newPage();
        await page.goto(config.qotdURL);

        let things = await page.$$(".scrollerItem:not(.Blank)");
        let questions = [];

        for (let thing of things) {
            let question = await thing.$eval(("h3"), node => node.innerText.trim());

            questions.push(question);
        };

        let question = filter.clean(questions[Math.floor(Math.random() * questions.length)]);

        let qotdMsg = new MessageEmbed()
            .setColor(0x009900)
            .setTitle(`Question Of The Day`)
            .setDescription(question);

        if (msg.channel.id === config.channels.qotd && msg.member.roles.cache.some(r => config.modRoles.includes(r.name))) {
            msg.reactions.removeAll();
            msg.react("✅")
                .catch(console.error)
                .then(console.info("Fetched QOTD successfully!"));
            msg.channel.send(qotdMsg);
        }

        await browser.close();
    } catch (err) {
        console.error(err);
    }
});

const start = (bot) => {
    let job = new CronJob(
        config.qotdTime,
        function() {
            console.info("ticked QOTD timer");
            scrape(bot.guilds);
        },
        function(err) {
            console.error(err);
            scrape(bot.guilds);
        },
        false,
        'America/New_York'
    );

    job.start();
};

module.exports = {
    start,
    ask
};