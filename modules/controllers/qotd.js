const puppeteer = require("puppeteer");
const CronJob = require('cron').CronJob;

let scrape = (async () => {
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

    let qotdMsg = new Discord.RichEmbed()
        .setColor(0x009900)
        .setTitle(`Question Of The Day`)
        .send(question);

    let channel = client.channels.get('name', 'general-development');

    channel.send(qotdMsg);

    await browser.close();
});

let job = new CronJob('0 8 * * *', function() {
    scrape();
}, null, true, 'America/New_York');

job.start();
